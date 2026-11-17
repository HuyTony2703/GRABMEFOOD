import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/container-liveness.mjs', import.meta.url));
async function probe(env) {
  const child = spawn(process.execPath, [script], { env, stdio: ['ignore', 'pipe', 'pipe'], timeout: 5000 });
  let output = '';
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const code = await new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', resolve);
  });
  return { code, output };
}
for (const [label, status, body, expected] of [
  ['scaffold process alive', 200, { status: 'alive', scope: 'scaffold' }, 0],
  ['dependency unavailable is not healthy', 503, { status: 'not-ready', scope: 'scaffold' }, 1],
  ['arbitrary success is not scaffold liveness', 200, { status: 'ok' }, 1],
]) {
  test(`container probe: ${label}`, async () => {
    const server = createServer((_request, response) => {
      response.writeHead(status, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(body));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    try {
      const { code, output } = await probe({
        PORT: String(server.address().port), HEALTH_PATH: '/health/live',
        ...(process.platform === 'win32' ? { SystemRoot: process.env.SystemRoot } : {}),
      });
      assert.equal(code, expected);
      assert.equal(output, '');
    } finally {
      server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
    }
  });
}
test('container probe rejects invalid port/path without network or sensitive logging', async () => {
  const result = await probe({ PORT: '0', HEALTH_PATH: '/api/v1/me?token=INERT_CANARY' });
  assert.equal(result.code, 1);
  assert.equal(result.output, '');
});
