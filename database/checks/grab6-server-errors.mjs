// Run from frontend/ after build. No Supabase or Cloud writes.
import { spawn } from "node:child_process";
import assert from "node:assert/strict";
import { request } from "node:http";

const base = "http://127.0.0.1:4242";
const app = spawn(process.execPath, ["server.mjs", "--production"], {
  env: { ...process.env, PORT: "4242" }, stdio: "ignore",
});
try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { ready = (await fetch(base + "/assets/rice.png")).status === 200; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert(ready, "Built server ready");
  for (const path of ["/assets/%", "/assets/%ZZ", "/assets/%E0%A4"]) {
    const response = await fetch(base + path);
    assert([400, 404].includes(response.status), path);
    assert.equal((await fetch(base + "/assets/rice.png")).status, 200, "Server survives malformed path");
  }
  const hostStatus = await new Promise((resolve, reject) => {
    const req = request(base + "/assets/rice.png", { headers: { Host: "%" } }, res => {
      res.resume(); resolve(res.statusCode);
    });
    req.on("error", reject);
    req.end();
  });
  assert([200, 400].includes(hostStatus), "Untrusted Host cannot crash request parsing");
  assert.equal((await fetch(base + "/assets/rice.png")).status, 200);
  console.log(JSON.stringify({ malformedPaths: 3, malformedHost: 1, survivalChecks: 4, failures: 0 }));
} finally {
  app.kill();
}
