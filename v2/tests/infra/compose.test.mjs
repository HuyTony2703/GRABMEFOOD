import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const proposal = JSON.parse(readFileSync(new URL('../../infra/image-proposal.json', import.meta.url), 'utf8'));
const profile = JSON.parse(readFileSync(new URL('../../infra/demo-lite.json', import.meta.url), 'utf8'));
const result = spawnSync('docker', [
  'compose', '--env-file', 'infra/.env.example', '-f', 'infra/compose.yaml', 'config', '--format', 'json',
], {
  cwd: root, encoding: 'utf8',
  env: { PATH: process.env.PATH ?? process.env.Path, SystemRoot: process.env.SystemRoot },
});
test('Compose parses without Engine startup/pull or Cloud credentials', () => {
  assert.equal(result.status, 0, 'docker compose config must parse successfully; Docker Compose CLI is required');
  assert.ok(JSON.parse(result.stdout).services);
});
test('Compose has exactly six local containers and approved caps/pins/no host mounts', () => {
  assert.equal(result.status, 0);
  const config = JSON.parse(result.stdout);
  assert.deepEqual(Object.keys(config.services).sort(), Object.keys(profile.containerMemoryMiB).sort());
  for (const [name, service] of Object.entries(config.services)) {
    // Compose5 emits byte counts as decimal strings; compare exact byte values.
    assert.equal(BigInt(service.mem_limit), BigInt(profile.containerMemoryMiB[name] * 1024 * 1024));
    assert.equal(BigInt(service.memswap_limit), BigInt(service.mem_limit));
    assert.equal(service.platform, 'linux/amd64');
    assert.equal(service.restart, 'no');
    assert.equal(service.pull_policy, 'never');
    for (const port of service.ports ?? []) assert.equal(port.host_ip, '127.0.0.1');
    for (const volume of service.volumes ?? []) assert.equal(volume.type, 'volume');
    if (name === 'rabbitmq') {
      assert.equal(service.image, `${proposal.rabbitmq.reference}@${proposal.rabbitmq.indexDigest}`);
      assert.equal(service.environment.RABBITMQ_DEFAULT_USER, 'gmf_demo');
      assert.equal(service.volumes[0].target, '/var/lib/rabbitmq');
    } else {
      assert.equal(service.environment.SUPABASE_PROJECT_REF, 'bdhavbwmxbttymerizvx');
      assert.equal(service.environment.NODE_ENV, 'production');
      assert.equal(service.environment.CONTAINER_BIND, 'true');
      assert.equal(service.environment.DATABASE_URL, undefined);
      assert.equal(service.read_only, true);
      assert.equal(service.init, true);
      assert.equal(service.labels['io.grabmefood.health-scope'], 'process-liveness-not-business-readiness');
      assert.equal(service.build.target, name === 'web' ? 'web-runtime' : 'nest-runtime');
    }
  }
  assert.equal(config.services.catalog.environment.DB_POOL_MAX, '4');
  assert.equal(config.services.community.environment.DB_POOL_MAX, '4');
  assert.equal(config.services.notification.environment.DB_POOL_MAX, '2');
});
test('Dockerfile preserves approved base digest, Linux isolation and non-root exec Node runtime', () => {
  const source = readFileSync(new URL('../../infra/Dockerfile', import.meta.url), 'utf8');
  for (const line of source.split('\n').filter(line => line.startsWith('FROM docker.io/'))) {
    assert.ok(line.includes(`${proposal.node.reference}@${proposal.node.indexDigest}`));
  }
  assert.doesNotMatch(source, /^RUN /m, 'Heavy Node builds must not escape the capped builder');
  assert.match(source, /ADD --chown=node:node \$\{ARTIFACT\}\.tar/);
  const builder = readFileSync(new URL('../../scripts/build-bounded.sh', import.meta.url), 'utf8');
  assert.match(builder, /--frozen-lockfile --ignore-scripts/);
  assert.match(builder, /deploy --prod --legacy/);
  assert.match(builder, /memory\.peak/);
  const runner = readFileSync(new URL('../../scripts/build-bounded.ps1', import.meta.url), 'utf8');
  assert.match(runner, /--memory \$cap --memory-swap \$cap/);
  assert.match(runner, /Windows Node processes present/);
  assert.equal((source.match(/^USER node$/gm) ?? []).length, 2);
  assert.equal((source.match(/^STOPSIGNAL SIGTERM$/gm) ?? []).length, 2);
  assert.match(source, /CMD \["node", "dist\/main.js"\]/);
  assert.doesNotMatch(source, /supabase\s+(?:start|db)|migrate|seed|reset/);
});
test('entrypoint gates resources and Cloud before Docker mutation, no implicit reset', () => {
  const source = readFileSync(new URL('../../scripts/start-demo.ps1', import.meta.url), 'utf8');
  assert.ok(source.indexOf("Assert-Preflight 'runtime'") < source.indexOf('& docker pull'));
  assert.ok(source.indexOf('if (-not $ScaffoldOnly)') < source.indexOf('& docker pull'));
  assert.match(source, /up -d --no-build --pull never --wait/);
  assert.match(source, /Assert-Preflight 'build'/);
  assert.doesNotMatch(source, /compose.*\bdown\b|Stop-Process|Remove-Item|docker\s+(?:rm|system|volume)|supabase\s+(?:start|db)/);
});
