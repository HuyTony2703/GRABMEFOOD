// Live GRAB-7 locked-session check. Requires isolated, signed-in Chrome profiles:
// admin at 9372 and a disposable non-admin test account at 9373.
// Never print tokens, emails, IDs, or upstream bodies. Only lock after preflight.
import assert from "node:assert/strict";

const app = "http://127.0.0.1:4173";
const project = "https://bdhavbwmxbttymerizvx.supabase.co";
const results = [];
let locked = false;
let admin, target, key;

async function session(port) {
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const tab = tabs.find(p => p.type === "page" && new URL(p.url).origin === app);
  assert(tab, "Missing app tab");
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  try {
    const token = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Browser session timed out")), 10000);
      socket.onmessage = event => {
        const response = JSON.parse(event.data);
        if (response.id !== 1) return;
        clearTimeout(timeout);
        if (response.error || response.result?.exceptionDetails) reject(new Error("Browser session unavailable"));
        else resolve(response.result?.result?.value);
      };
      socket.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: {
        expression: `location.origin === ${JSON.stringify(app)}
          ? JSON.parse(sessionStorage.getItem("sb-bdhavbwmxbttymerizvx-auth-token") || "null")?.access_token : null`,
        returnByValue: true,
      } }));
    });
    assert(typeof token === "string" && token.length > 0, "Sign in to both browsers first");
    const response = await fetch(project + "/auth/v1/user", {
      headers: { apikey: key, Authorization: `Bearer ${token}` },
    });
    assert.equal(response.status, 200, "Auth must verify existing session");
    const user = await response.json();
    assert(user.id, "Auth user ID must exist");
    return { token, id: user.id };
  } finally {
    socket.close();
  }
}

async function request(identity, base, path, body) {
  const response = await fetch(base + path, {
    method: body === undefined ? "GET" : "POST",
    headers: { apikey: key, Authorization: `Bearer ${identity.token}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(20000),
  });
  return response.status;
}
async function state(identity) {
  const response = await fetch(project + "/rest/v1/rpc/is_admin", {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${identity.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({}),
    signal: AbortSignal.timeout(20000),
  });
  assert.equal(response.status, 200, "Admin preflight RPC unavailable");
  return response.json();
}
async function setLocked(value) {
  return request(admin, project, "/rest/v1/rpc/admin_set_account_state", {
    p_target_user: target.id, p_make_locked: value, p_make_admin: false,
  });
}
function check(name, condition) {
  assert(condition, name);
  results.push(name);
}

try {
  const configResponse = await fetch(app + "/api/client-config");
  assert.equal(configResponse.status, 200);
  const config = await configResponse.json();
  assert.equal(config.url, project, "Wrong Supabase project");
  key = config.key;
  admin = await session(9372);
  target = await session(9373);
  check("distinct users", admin.id !== target.id);
  check("admin permission", await state(admin) === true);
  check("target is not admin", await state(target) === false);
  check("target initially active", await request(target, app, "/api/collections") === 200);
  // An ambiguous network failure may occur after the RPC committed. Always
  // attempt unlock once a lock request has been sent.
  locked = true;
  const lockStatus = await setLocked(true);
  check("admin locked target", lockStatus >= 200 && lockStatus < 300);
  check("old token cannot list private collections",
    await request(target, app, "/api/collections") === 401);
  check("old token cannot random",
    await request(target, app, "/api/random", { kind: "restaurant" }) === 401);
  check("old token cannot create collection",
    await request(target, app, "/api/collections",
      { kind: "restaurant", name: "must-not-persist-locked" }) === 401);
  check("direct RLS hides private collections",
    await (async () => {
      const response = await fetch(project + "/rest/v1/collections?select=id", {
        headers: { apikey: key, Authorization: `Bearer ${target.token}` },
        signal: AbortSignal.timeout(20000),
      });
      return response.status === 200 && (await response.json()).length === 0;
    })());
} catch {
  process.exitCode = 1;
  console.error("Locked-session check failed; no credentials or identifiers logged");
} finally {
  if (locked) {
    try {
      const status = await setLocked(false);
      check("admin unlocked target", status >= 200 && status < 300);
      check("target active again", await request(target, app, "/api/collections") === 200);
    } catch {
      process.exitCode = 1;
      console.error("CRITICAL: automatic unlock failed; verify target state using approved admin RPC");
    }
  }
  console.log(JSON.stringify({ checks: results, passed: process.exitCode !== 1, unlockAttempted: locked }));
}
