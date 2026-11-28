// Read-only real-browser smoke. Requires installed Chrome and process env keys.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const url = process.env.GMF_SUPABASE_URL;
const key = process.env.GMF_SUPABASE_PUBLISHABLE_KEY;
assert(url && key, "Process URL and publishable key required");
const server = createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.end("<!doctype html><title>GRAB-4 read-only smoke</title>");
});
await new Promise(resolve => server.listen(4239, "127.0.0.1", resolve));
const profile = mkdtempSync(join(process.env.LOCALAPPDATA, "Temp", "opencode", "grab4-"));
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless", "--disable-gpu", "--no-first-run", "--remote-debugging-port=9368",
  `--user-data-dir=${profile}`, "http://127.0.0.1:4239",
], { stdio: "ignore" });
let socket;
try {
  let page;
  for (let i = 0; i < 80; i++) {
    try {
      const pages = await (await fetch("http://127.0.0.1:9368/json/list")).json();
      page = pages.find(p => p.type === "page");
      if (page?.url === "http://127.0.0.1:4239/") break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(page, "Chrome available");
  await new Promise(resolve => setTimeout(resolve, 500));
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const expression = `(async () => {
    const r = await fetch(${JSON.stringify(url + "/rest/v1/restaurants?select=id,is_public")}, {
      headers: { apikey: ${JSON.stringify(key)} }
    });
    const rows = await r.json();
    return { origin: location.origin, status: r.status,
      rows: Array.isArray(rows) ? rows.length : null,
      onlyPublic: Array.isArray(rows) && rows.every(x => x.is_public === true) };
  })()`;
  const result = await new Promise((resolve, reject) => {
    socket.onmessage = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === 1) {
        if (msg.error || msg.result?.exceptionDetails) reject(new Error("Browser evaluation failed"));
        else resolve(msg.result?.result?.value);
      }
    };
    socket.onerror = reject;
    socket.send(JSON.stringify({ id: 1, method: "Runtime.evaluate",
      params: { expression, awaitPromise: true, returnByValue: true } }));
  });
  console.log(JSON.stringify(result));
  assert.equal(result.origin, "http://127.0.0.1:4239");
  assert.equal(result.status, 200);
  assert(result.rows > 0 && result.onlyPublic);
} finally {
  socket?.close();
  chrome.kill();
  server.close();
}
