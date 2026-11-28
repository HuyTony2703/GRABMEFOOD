// Actual Chrome -> frontend proxy -> Spring HTTP -> in-memory Supabase fixture.
// No Cloud requests or credentials. This is NOT evidence of real Supabase Auth/RLS.
// From frontend/: npm run build; from backend/: mvnw package; then run from frontend/.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import assert from "node:assert/strict";

const userId = "00000000-0000-0000-0000-000000000001";
const targetId = "00000000-0000-0000-0000-000000000003";
const collectionId = "00000000-0000-0000-0000-000000000002";
const token = [Buffer.from('{"alg":"HS256"}').toString("base64url"),
  Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 3600 })).toString("base64url"), "fixture"].join(".");
const user = { id: userId, aud: "authenticated", role: "authenticated", email: "fixture@example.invalid",
  email_confirmed_at: "2026-01-01T00:00:00Z", app_metadata: {}, user_metadata: {}, identities: [], created_at: "2026-01-01T00:00:00Z" };
let collections = [], saved = [], visible = true, locked = false;
let springReads = 0, springWrites = 0;
const upstream = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204).end(); return; }
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  let raw = ""; for await (const part of req) raw += part;
  const body = raw ? JSON.parse(raw) : {};
  let result = [];
  if (path === "/auth/v1/token") result = { access_token: token, token_type: "bearer", refresh_token: "fixture-refresh",
    expires_in: 3600, user };
  else if (path === "/auth/v1/user") result = user;
  else if (path === "/auth/v1/logout") { res.writeHead(204).end(); return; }
  else if (path === "/rest/v1/rpc/is_active") result = !locked;
  else {
    if (req.headers.authorization === `Bearer ${token}`) {
      if (req.method === "GET") springReads++; else springWrites++;
    }
    const matches = row => [...url.searchParams].every(([key, value]) =>
      !value.startsWith("eq.") || String(row[key]) === value.slice(3));
    if (path === "/rest/v1/collections") {
      if (req.method === "POST") { const row = { ...body, id: collectionId }; collections.push(row); result = [row]; }
      else if (req.method === "DELETE") { result = collections.filter(matches); collections = collections.filter(row => !matches(row)); saved = []; }
      else if (req.method === "PATCH") { collections = collections.map(row => matches(row) ? { ...row, ...body } : row); result = collections.filter(matches); }
      else result = collections.filter(matches);
    } else if (path === "/rest/v1/saved_items") {
      if (req.method === "POST") { saved.push(body); result = [body]; }
      else if (req.method === "DELETE") { result = saved.filter(matches); saved = saved.filter(row => !matches(row)); }
      else result = saved.filter(matches);
    } else if (path === "/rest/v1/restaurants") {
      const row = { id: targetId, is_public: visible, name_vi: "Quán kiểm thử", name_en: "Fixture restaurant",
        description_vi: "Minh họa local", description_en: "Local fixture", address: "", map_url: null };
      result = visible ? [row].filter(matches) : [];
    }
    const offset = Number(url.searchParams.get("offset") ?? 0);
    const limit = Number(url.searchParams.get("limit") ?? 1000);
    result = result.slice(offset, offset + limit);
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result));
});
await new Promise(ok => upstream.listen(4253, "127.0.0.1", ok));
const env = { ...process.env, GMF_SUPABASE_URL: "http://127.0.0.1:4253",
  GMF_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_local_fixture", GMF_BACKEND_ORIGIN: "http://127.0.0.1:4252",
  GMF_PUBLIC_SITE_ORIGIN: "http://127.0.0.1:4251", PORT: "4251" };
const backend = spawn("java", ["-jar", resolve("../backend/target/grabmefood-backend-0.0.1-SNAPSHOT.jar"),
  "--server.port=4252", "--server.address=127.0.0.1"], { env, stdio: "ignore" });
const frontend = spawn(process.execPath, ["server.mjs", "--production"], { env, stdio: "ignore" });
const profile = mkdtempSync(join(process.env.LOCALAPPDATA, "Temp", "opencode", "grab7-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless", "--disable-gpu",
  "--no-first-run", "--remote-debugging-port=9371", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const evidence = resolve("../docs/evidence/grab7-integration-2026-11-28");
mkdirSync(evidence, { recursive: true });
const wait = ms => new Promise(ok => setTimeout(ok, ms));
let ws, nextId = 0;
const pending = new Map(), checks = [], errors = [];
try {
  let page;
  for (let i = 0; i < 150; i++) {
    try {
      const r = await fetch("http://127.0.0.1:4252/api/collections");
      page = (await (await fetch("http://127.0.0.1:9371/json/list")).json()).find(p => p.type === "page");
      if (r.status === 401 && page && (await fetch(env.GMF_PUBLIC_SITE_ORIGIN + "/tai-khoan")).ok) break;
    } catch {}
    await wait(100);
  }
  assert(page, "Chrome and servers ready");
  const callbackShell = await fetch(env.GMF_PUBLIC_SITE_ORIGIN + "/tai-khoan/callback?code=fixture-sensitive-code");
  assert.equal(callbackShell.headers.get("cache-control"), "no-store");
  assert.equal(callbackShell.headers.get("referrer-policy"), "no-referrer");
  assert(!(await callbackShell.text()).includes("fixture-sensitive-code"));
  checks.push("callback HTML no-store and no OAuth code in bootstrap");
  ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((ok, fail) => { ws.onopen = ok; ws.onerror = fail; });
  ws.onmessage = event => {
    const msg = JSON.parse(event.data);
    if (msg.method === "Runtime.exceptionThrown") errors.push("uncaught browser exception");
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") errors.push("browser console error");
    if (pending.has(msg.id)) {
      const { ok, fail, timer } = pending.get(msg.id); clearTimeout(timer); pending.delete(msg.id);
      if (msg.error || msg.result?.exceptionDetails) fail(new Error("CDP evaluation failed: " +
        (msg.error?.message ?? msg.result.exceptionDetails.exception?.description ?? msg.result.exceptionDetails.text)));
      else ok(msg.result);
    }
  };
  const cdp = (method, params = {}) => new Promise((ok, fail) => {
    const id = ++nextId;
    const timer = setTimeout(() => { pending.delete(id); fail(new Error("CDP timeout")); }, 15000);
    pending.set(id, { ok, fail, timer }); ws.send(JSON.stringify({ id, method, params }));
  });
  const js = async expression => (await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result.value;
  const until = async (expression, label) => {
    for (let i = 0; i < 120; i++) { try { if (await js(expression)) { checks.push(label); return; } } catch {} await wait(100); }
    throw new Error("Timed out: " + label);
  };
  const navigate = path => cdp("Page.navigate", { url: env.GMF_PUBLIC_SITE_ORIGIN + path });
  const capture = async name => {
    for (const width of [1280, 390]) {
      await cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
      assert.equal(await js("document.documentElement.scrollWidth > innerWidth"), false, name + " overflow");
      const image = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      writeFileSync(join(evidence, `${name}-${width}.png`), Buffer.from(image.data, "base64"));
    }
  };
  const click = label => js(`(() => { const b=[...document.querySelectorAll("button")].find(b=>b.textContent===${JSON.stringify(label)}); if(!b||b.disabled)throw Error("button");b.click(); })()`);
  const input = (name, value) => js(`(() => {const e=document.querySelector('input[name="${name}"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event("input",{bubbles:true}));})()`);
  await cdp("Runtime.enable");
  for (const width of [1280, 390]) {
    await cdp("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await navigate("/tai-khoan?lang=en&returnTo=%2Fbo-suu-tap%3Flang%3Den");
    await until(`!!document.querySelector('input[name="email"]')`, `login form ${width}`);
    assert.equal(await js("document.documentElement.scrollWidth > innerWidth"), false, "No horizontal overflow");
    const screenshot = await cdp("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
    writeFileSync(join(evidence, `login-${width}.png`), Buffer.from(screenshot.data, "base64"));
  }
  await input("email", "fixture@example.invalid"); await input("password", "local-fixture-only");
  await click("Sign in with email");
  await until(`location.pathname==="/bo-suu-tap" && !!document.querySelector('input[name="name"]')`, "SDK login and return to collections");
  await until(`[...document.querySelectorAll("button")].some(b=>b.textContent==="Create collection"&&!b.disabled)`, "collections loaded");
  await input("name", "Lunch fixture");
  await click("Create collection");
  await until(`document.body.textContent.includes("Lunch fixture") && !document.querySelector('button[type="submit"]:disabled')`, "create collection through Spring");
  await navigate(`/quan/${targetId}?lang=en`);
  await until(`[...document.querySelectorAll("button")].some(b=>b.textContent==="Save"&&!b.disabled)`, "public detail with authenticated save");
  await click("Save");
  await until(`document.body.textContent.includes("Lunch fixture")`, "load owned collections for save");
  await js(`document.querySelector('.save-chooser input[type="radio"]').click()`);
  await click("Save to collection");
  await until(`document.body.textContent.includes("Saved to the selected collection.")`, "save one selected collection through Spring");
  await navigate("/random?lang=en");
  await until(`[...document.querySelectorAll("button")].some(b=>b.textContent==="Start random"&&!b.disabled)`, "random page ready");
  await click("Start random");
  await until(`document.body.textContent.includes("May repeat on the next draw.")`, "random returns available saved target");
  await capture("random");
  visible = false;
  await click("Start random");
  await until(`document.body.textContent.includes("No available saved items.")`, "hidden target excluded on next draw");
  await navigate("/bo-suu-tap?lang=en");
  await until(`[...document.querySelectorAll("button")].some(b=>b.textContent==="Lunch fixture"&&!b.disabled)`, "collections reread");
  await click("Lunch fixture");
  await until(`document.body.textContent.includes("No longer available")`, "unavailable marker contains no target payload");
  await capture("collections");
  assert.equal(await js(`document.querySelector("main").textContent.includes("Fixture restaurant")`), false);
  await input("rename", "Renamed fixture");
  await click("Rename");
  await until(`document.querySelector("h2")?.textContent==="Renamed fixture"`, "rename through Spring");
  await click("Remove from collection");
  await until(`document.body.textContent.includes("This collection is empty.")`, "remove only selected saved entry");
  await click("Delete collection");
  await until(`document.body.textContent.includes("Only this collection and its saved entries are removed")`, "delete explains scope before confirm");
  await click("Confirm deletion");
  await until(`document.body.textContent.includes("No collections yet.")`, "delete collection through Spring");
  await navigate("/random?lang=en");
  await until(`[...document.querySelectorAll("button")].some(b=>b.textContent==="Start random"&&!b.disabled)`, "random ready before lock");
  locked = true;
  await click("Start random");
  await until(`document.body.textContent.includes("To use your private saved items.")`, "locked session denied and private UI cleared");
  assert.equal(errors.length, 0, "No browser runtime/console errors");
  assert(springReads > 0 && springWrites >= 2, "Actual Spring requests reached fixture");
  writeFileSync(join(evidence, "local-browser-results.json"), JSON.stringify({ scope: "local mocked Supabase upstream; actual Chrome and Spring",
    checks, failures: 0, springReads, springWrites, errors }, null, 2));
  console.log(JSON.stringify({ checks: checks.length, failures: 0, springReads, springWrites }));
} catch (error) {
  console.error(JSON.stringify({ completedChecks: checks, errors, failure: String(error) }));
  throw error;
} finally {
  ws?.close(); chrome.kill(); frontend.kill(); backend.kill();
  await new Promise(ok => upstream.close(ok));
}
