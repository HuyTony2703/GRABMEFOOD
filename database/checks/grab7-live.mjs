// Run from frontend/ after signing into the app in isolated Chrome test profiles.
// Chrome CDP ports 9372 (A) and 9373 (B); never reads browser data outside this app.
// Uses existing browser sessions in memory; never prints/writes tokens, user IDs or email.
// Creates and finally deletes only this run's private collection fixtures.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const app = "http://127.0.0.1:4173";
const project = "https://bdhavbwmxbttymerizvx.supabase.co";
const results = [], cleanup = [];
let sessionDiagnostic = "not-started";
const configResponse = await fetch(app + "/api/client-config");
assert.equal(configResponse.status, 200, "App configuration available");
const config = await configResponse.json();
assert.equal(config.url, project, "Correct Supabase project");

async function browserSession(port) {
  sessionDiagnostic = "browser-connect";
  const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = pages.find(p => p.type === "page" && new URL(p.url).origin === app);
  assert(page, "An app tab must be open in each test browser");
  sessionDiagnostic = "read-app-session";
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail; });
  try {
    const value = await new Promise((ok, fail) => {
      const timer = setTimeout(() => fail(new Error("Browser session read timed out")), 10000);
      socket.onmessage = event => {
        const response = JSON.parse(event.data);
        if (response.id !== 1) return;
        clearTimeout(timer);
        if (response.error || response.result?.exceptionDetails) fail(new Error("Cannot read app session"));
        else ok(response.result?.result?.value);
      };
      socket.send(JSON.stringify({ id: 1, method: "Runtime.evaluate", params: {
        expression: `location.origin === ${JSON.stringify(app)}
          ? JSON.parse(sessionStorage.getItem("sb-bdhavbwmxbttymerizvx-auth-token") || "null")?.access_token : null`,
        returnByValue: true,
      } }));
    });
    assert(typeof value === "string" && value.length > 0, "Sign into the app first; do not paste tokens into chat");
    sessionDiagnostic = "verify-auth-session";
    const response = await fetch(project + "/auth/v1/user", {
      headers: { apikey: config.key, Authorization: `Bearer ${value}` },
    });
    sessionDiagnostic = `auth-http-${response.status}`;
    if (response.status !== 200) {
      const error = await response.json().catch(() => ({}));
      const errorCode = error.error_code ?? error.code;
      if (typeof errorCode === "string" && /^[a-z0-9_]+$/.test(errorCode)) sessionDiagnostic += `-${errorCode}`;
      const message = String(error.message ?? error.msg ?? error.error ?? "");
      for (const [pattern, label] of [[/api.?key/i, "api-key"], [/jwt/i, "jwt"], [/session/i, "session"],
        [/forbidden/i, "forbidden"], [/blocked/i, "blocked"], [/user/i, "user"]]) {
        if (pattern.test(message)) sessionDiagnostic += `-${label}`;
      }
    }
    assert.equal(response.status, 200, "Session verified by real Supabase Auth");
    const user = await response.json();
    assert(user.id, "Authenticated user exists");
    return { token: value, id: user.id, googleIdentity: user.identities?.some(i => i.provider === "google") === true };
  } finally { socket.close(); }
}
async function api(session, method, path, body) {
  const response = await fetch(app + path, { method, headers: {
    Authorization: `Bearer ${session.token}`, "Content-Type": "application/json",
  }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(45000) });
  assert.equal(response.headers.get("cache-control"), "no-store");
  return { status: response.status, data: response.status === 204 ? null : await response.json() };
}
function passed(name) { results.push({ check: name, passed: true }); }
async function create(session, suffix) {
  const response = await api(session, "POST", "/api/collections",
    { name: `GRAB7-check-${randomUUID()}-${suffix}`, kind: "restaurant" });
  assert.equal(response.status, 201, "Fixture collection created");
  const id = response.data[0]?.id;
  assert(typeof id === "string", "Created fixture ID returned");
  cleanup.push({ session, id });
  return id;
}
let failure = false;
let stage = "session-a";
try {
  const a = await browserSession(9372);
  stage = "session-b";
  let b;
  try { b = await browserSession(9373); } catch { /* Report missing B explicitly below. */ }
  stage = "distinct-test-users";
  if (b) assert.notEqual(a.id, b.id, "A and B must be different test users");
  stage = "collection-and-random-checks";
  passed(a.googleIdentity ? "A Auth session verified with Google identity" : "A Auth session verified (not Google proof)");
  const targetResponse = await fetch(project + "/rest/v1/restaurants?select=id&is_public=eq.true&limit=1", { headers: { apikey: config.key } });
  assert.equal(targetResponse.status, 200);
  const target = (await targetResponse.json())[0]?.id;
  assert(target, "A public restaurant is available");
  const first = await create(a, "A1");
  const second = await create(a, "A2");
  passed("Create two private collections through frontend and Spring");
  for (const id of [first, second]) {
    assert.equal((await api(a, "POST", `/api/collections/${id}/items`, { kind: "restaurant", targetId: target })).status, 201);
  }
  passed("Save the same target in two collections");
  assert.equal((await api(a, "POST", `/api/collections/${first}/items`, { kind: "restaurant", targetId: target })).status, 409);
  passed("Duplicate save has explicit conflict");
  assert.equal((await api(a, "POST", `/api/collections/${first}/items`, { kind: "dish", targetId: target })).status, 400);
  passed("Wrong collection kind rejected");
  const ownItems = await api(a, "GET", `/api/collections/${first}/items`);
  assert.equal(ownItems.status, 200);
  assert(ownItems.data.some(item => item.targetId === target && item.available));
  passed("Read owned saved items from real Data API");
  const random = await api(a, "POST", "/api/random", { kind: "restaurant", selected: [target] });
  assert.equal(random.status, 200);
  assert.equal(random.data.item?.targetId, target);
  passed("Random selected saved target through real Spring and Data API");
  const empty = await api(a, "POST", "/api/random", { kind: "restaurant", selected: [] });
  assert.equal(empty.data.state, "empty");
  passed("Explicit empty selection does not fall back to all");
  const unsaved = await api(a, "POST", "/api/random", { kind: "restaurant", selected: [randomUUID()] });
  assert.equal(unsaved.data.state, "empty");
  passed("Unsaved target is excluded");
  assert.equal((await api(a, "PATCH", `/api/collections/${first}`, { name: "GRAB7 renamed fixture" })).status, 200);
  passed("Rename owned collection");
  assert.equal((await api(a, "DELETE", `/api/collections/${first}/items/restaurant/${target}`)).status, 204);
  const remaining = await api(a, "GET", `/api/collections/${second}/items`);
  assert(remaining.data.some(item => item.targetId === target));
  passed("Unsave only affects the selected collection");
  if (b) {
    const other = await create(b, "B");
    const listA = await api(a, "GET", "/api/collections");
    const listB = await api(b, "GET", "/api/collections");
    assert(!listA.data.some(c => c.id === other));
    assert(!listB.data.some(c => [first, second].includes(c.id)));
    assert.equal((await api(b, "PATCH", `/api/collections/${first}`, { name: "Must not persist" })).status, 404);
    assert.equal((await api(b, "DELETE", `/api/collections/${first}`)).status, 404);
    assert.equal((await api(b, "GET", `/api/collections/${first}/items`)).status, 404);
    passed("A/B cannot list, rename, delete or read each other's collection");
    const direct = await fetch(project + `/rest/v1/collections?select=id&id=eq.${first}`, {
      headers: { apikey: config.key, Authorization: `Bearer ${b.token}` },
    });
    assert.equal(direct.status, 200);
    assert.deepEqual(await direct.json(), []);
    passed("Direct Data API RLS also hides A collection from B");
  } else {
    results.push({ check: "A/B real RLS", passed: false, skipped: true, reason: "Second test browser session unavailable" });
  }
} catch {
  failure = true;
  // Upstream responses may contain user data; never print exception details.
  results.push({ check: "Live verification stopped", passed: false, stage, reason: "A prerequisite or assertion failed; no credentials logged" });
} finally {
  let cleanupFailures = 0;
  for (const fixture of cleanup.reverse()) {
    try { assert.equal((await api(fixture.session, "DELETE", `/api/collections/${fixture.id}`)).status, 204); }
    catch { cleanupFailures++; }
  }
  const evidence = resolve("../docs/evidence/grab7-integration-2026-11-28");
  mkdirSync(evidence, { recursive: true });
  const summary = { scope: "Real Supabase Auth session, frontend proxy, Spring, Data API; own private fixtures only",
    checks: results, cleanupFailures, status: failure || cleanupFailures ? "failed" : "partial",
    notCovered: ["email verification delivery", "Google consent/callback browser trace", "recovery email/link", "locked user on Cloud"] };
  writeFileSync(join(evidence, "live-results.json"), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ stage, sessionDiagnostic, passed: results.filter(r => r.passed).length,
    skipped: results.filter(r => r.skipped).length, failed: failure, cleanupFailures }));
  if (failure || cleanupFailures) process.exitCode = 1;
}
