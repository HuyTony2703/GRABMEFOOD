import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { once } from 'node:events';
import { createServer } from 'node:net';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const canary = 'INERT_SMOKE_CANARY_NOT_A_CREDENTIAL';
const envFor = (port, mode = 'test') => ({
  NODE_ENV: mode, PORT: String(port), HOST: '127.0.0.1', NEXT_TELEMETRY_DISABLED: '1',
  ...(process.platform === 'win32' ? { SystemRoot: process.env.SystemRoot } : {}),
});
async function freePort() {
  const server = createServer();
  await new Promise((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolveListen);
  });
  const port = server.address().port;
  await new Promise(resolveClose => server.close(resolveClose));
  return port;
}
function launch(entry, cwd, port, args = [], mode = 'test') {
  const child = fork(entry, args, { cwd, env: envFor(port, mode), silent: true });
  const state = { child, output: '' };
  child.stdout.on('data', data => { state.output += data.toString(); });
  child.stderr.on('data', data => { state.output += data.toString(); });
  // Register immediately, including for startup failures.
  state.exited = once(child, 'exit');
  return state;
}
async function getWhenListening(state, url) {
  for (let attempt = 0; attempt < 150; attempt++) {
    if (state.child.exitCode !== null || state.child.signalCode !== null) {
      throw new Error(`Child exited before liveness: ${state.output}`);
    }
    try { return await fetch(url, { signal: AbortSignal.timeout(1000) }); }
    catch { await delay(100); }
  }
  throw new Error(`Child did not become live: ${state.output}`);
}
async function stop(state, graceful) {
  if (state.child.exitCode !== null || state.child.signalCode !== null) return;
  if (graceful && state.child.connected) state.child.send('shutdown');
  else state.child.kill('SIGTERM');
  let timer;
  try {
    const result = await Promise.race([
      state.exited,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Child shutdown timeout')), 10000); }),
    ]);
    if (graceful) {
      assert.equal(result[0], 0, state.output);
      assert.match(state.output, /"event":"service.stopped"/);
    }
  } finally {
    clearTimeout(timer);
    if (state.child.exitCode === null && state.child.signalCode === null) state.child.kill('SIGTERM');
  }
}

for (const [service, directory] of [
  ['gateway', 'apps/gateway'], ['catalog', 'services/catalog'],
  ['community', 'services/community'], ['notification', 'services/notification'],
]) {
  const port = await freePort();
  const cwd = resolve(root, directory);
  const state = launch(resolve(cwd, 'dist/main.js'), cwd, port);
  try {
    const base = `http://127.0.0.1:${port}`;
    const live = await getWhenListening(state, `${base}/health/live`);
    assert.equal(live.status, 200);
    assert.deepEqual(await live.json(), { service, status: 'alive', scope: 'scaffold' });
    assert.equal(live.headers.get('cache-control'), 'no-store');
    assert.match(live.headers.get('x-request-id'), /^[0-9a-f-]{36}$/);
    const ready = await fetch(`${base}/health/ready`);
    assert.equal(ready.status, 503);
    assert.equal((await ready.json()).checks[0].status, 'not-implemented');
    const absent = await fetch(`${base}/api/v1/me?token=${canary}`, {
      headers: { authorization: `Bearer ${canary}`, 'x-user-id': 'forged', 'x-role': 'admin' },
    });
    assert.equal(absent.status, 404, 'No private business API may accidentally exist');
    await stop(state, true);
    assert.ok(!state.output.includes(canary), 'Never log query/body/auth headers');
    console.log(`PASS ${service}: independent start, live200, honest ready503, business404, safe request log, app.close via test IPC`);
  } finally {
    await stop(state, false);
  }
}

const webCwd = resolve(root, 'apps/web');
const requireWeb = createRequire(resolve(webCwd, 'package.json'));
const port = await freePort();
const web = launch(requireWeb.resolve('next/dist/bin/next'), webCwd, port,
  ['start', '-H', '127.0.0.1', '-p', String(port)], 'production');
try {
  const base = `http://127.0.0.1:${port}`;
  const live = await getWhenListening(web, `${base}/api/health/live`);
  assert.equal(live.status, 200);
  assert.deepEqual(await live.json(), { service: 'web', status: 'alive', scope: 'scaffold' });
  assert.equal((await fetch(`${base}/api/health/ready`)).status, 503);
  const page = await fetch(base);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /khung kỹ thuật/);
  assert.equal((await fetch(`${base}/api/v1/me`)).status, 404);
  console.log('PASS web: independent production start, live200, honest ready503, diagnostic HTML, no business API');
} finally {
  await stop(web, false);
}
