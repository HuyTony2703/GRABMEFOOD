import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluatePreflight, localPorts, thresholds } from '../../scripts/preflight-policy.mjs';

const valid = () => ({
  ...thresholds,
  dockerEngineReachable: true, dockerOsType: 'linux', composeAvailable: true,
  dockerMemoryMiB: 7792,
  ports: Object.fromEntries(localPorts.map(port => [port, true])),
});
test('exact approved host thresholds pass without claiming Cloud or image approval', () => {
  const report = evaluatePreflight(valid());
  assert.equal(report.status, 'pass');
  assert.equal(report.cloud.status, 'not-verified');
  assert.equal(report.imageApproval, 'separate-owner-gate');
});
for (const name of Object.keys(thresholds)) {
  test(`${name}: below threshold and unknown/non-numeric measurements block`, () => {
    for (const value of [thresholds[name] - 0.001, undefined, null, NaN, Infinity, -1, '99']) {
      assert.equal(evaluatePreflight({ ...valid(), [name]: value }).status, 'blocked');
    }
  });
}
test('available workspace disk does not substitute for unknown Docker data disk', () => {
  const input = { ...valid(), workspaceFreeGiB: 60.68 };
  delete input.dockerDataFreeGiB;
  const report = evaluatePreflight(input);
  assert.equal(report.status, 'blocked');
  assert.equal(report.checks.find(check => check.name === 'dockerDataFreeGiB').status, 'unknown');
});
test('relocated Docker data uses its measured volume, not the Windows/temp C drive', () => {
  const input = { ...valid(), dockerDataFreeGiB: 59.129, workspaceFreeGiB: 59.129, systemDriveFreeGiB: 14.818 };
  const report = evaluatePreflight(input);
  assert.equal(report.status, 'pass');
  const disk = report.checks.find(check => check.name === 'dockerDataFreeGiB');
  assert.equal(disk.actual, 59.129);
  assert.equal(disk.minimum, 15);
  assert.equal(disk.status, 'pass');
  // A large Windows/temp volume may not mask insufficient Docker-data space either.
  assert.equal(evaluatePreflight({ ...input, dockerDataFreeGiB: 14.999, systemDriveFreeGiB: 100 }).status, 'blocked');
});
test('host collector measures explicit DockerDataPath instead of a fixed C directory', () => {
  const source = readFileSync(new URL('../../scripts/preflight.ps1', import.meta.url), 'utf8');
  assert.match(source, /\$measurement\.dockerDataFreeGiB = Get-ExistingPathFreeGiB \$DockerDataPath/);
  assert.doesNotMatch(source, /['"]C:\\/i);
});
test('Engine running does not override insufficient host free RAM', () => {
  const report = evaluatePreflight({ ...valid(), freeRamGiB: 2.93 });
  assert.equal(report.status, 'blocked');
  assert.equal(report.checks.find(check => check.name === 'dockerEngine').status, 'pass');
});
test('budget-based demo-lite requires workload cap plus VM allowance and Windows reserve', () => {
  const input = { ...valid(), freeRamGiB: 4.25 };
  const runtime = evaluatePreflight(input, { profile: 'demo-lite', phase: 'runtime' });
  assert.equal(runtime.status, 'pass');
  assert.equal(runtime.profile, 'demo-lite');
  assert.equal(runtime.phase, 'runtime');
  assert.equal(runtime.checks.find(check => check.name === 'freeRamGiB').minimum, 4.25);
  assert.equal(runtime.budget.requiredAvailableMiB, 2048 + 1280 + 1024);
  assert.equal(runtime.budget.swapAsRam, false);
  assert.equal(evaluatePreflight(input).status, 'blocked');
  assert.equal(evaluatePreflight(input, { profile: 'full', phase: 'runtime' }).status, 'blocked');
  assert.equal(evaluatePreflight(input, { profile: 'demo-lite', phase: 'build' }).status, 'pass');
  for (const phase of ['build', 'runtime']) {
    assert.equal(evaluatePreflight({ ...input, freeRamGiB: 4.249 }, { profile: 'demo-lite', phase }).status, 'blocked');
  }
});
test('demo-lite runtime cannot waive missing disk, RAM or Engine', () => {
  const options = { profile: 'demo-lite', phase: 'runtime' };
  for (const patch of [
    { freeRamGiB: 4.249 }, { dockerDataFreeGiB: 14.999 }, { dockerDataFreeGiB: undefined },
    { dockerEngineReachable: false },
  ]) {
    assert.equal(evaluatePreflight({ ...valid(), ...patch }, options).status, 'blocked');
  }
});
test('Docker VM capacity is independently checked, never substituted for Windows available RAM', () => {
  const options = { profile: 'demo-lite', phase: 'build' };
  assert.equal(evaluatePreflight({ ...valid(), dockerMemoryMiB: 3327 }, options).status, 'blocked');
  assert.equal(evaluatePreflight({ ...valid(), dockerMemoryMiB: undefined }, options).status, 'blocked');
  assert.equal(evaluatePreflight({ ...valid(), dockerMemoryMiB: 3328 }, options).status, 'pass');
  assert.equal(evaluatePreflight({ ...valid(), dockerMemoryMiB: 16000, freeRamGiB: 1 }, options).status, 'blocked');
});
test('profile and phase must be explicit supported choices, never silently guessed', () => {
  for (const options of [{ profile: 'lite' }, { phase: 'dev' }, { profile: '' }]) {
    assert.throws(() => evaluatePreflight(valid(), options));
  }
});
test('CLI carries explicit demo-lite/runtime flags and rejects unknown switches', () => {
  const script = fileURLToPath(new URL('../../scripts/preflight-policy.mjs', import.meta.url));
  const input = JSON.stringify({ ...valid(), freeRamGiB: 4.25 });
  const accepted = spawnSync(process.execPath, [script, '--profile', 'demo-lite', '--phase', 'runtime'], { input, encoding: 'utf8' });
  assert.equal(accepted.status, 0);
  assert.equal(JSON.parse(accepted.stdout).profile, 'demo-lite');
  const rejected = spawnSync(process.execPath, [script, '--override-ram', '1'], { input, encoding: 'utf8' });
  assert.equal(rejected.status, 2);
});
test('Engine, Linux and Compose are independent fail-closed gates', () => {
  for (const patch of [{ dockerEngineReachable: false }, { dockerOsType: 'windows' }, { composeAvailable: false }]) {
    assert.equal(evaluatePreflight({ ...valid(), ...patch }).status, 'blocked');
  }
});
test('each unavailable port blocks; successful probes do not reserve ports after return', () => {
  for (const port of localPorts) {
    const input = valid();
    input.ports[port] = false;
    assert.equal(evaluatePreflight(input).status, 'blocked');
  }
});
test('report does not copy arbitrary fields or credentials', () => {
  const report = evaluatePreflight({ ...valid(), DATABASE_URL: 'INERT_CANARY_NEVER_A_SECRET' });
  assert.ok(!JSON.stringify(report).includes('INERT_CANARY'));
});
test('CLI fails closed on malformed input without echoing it', () => {
  const script = fileURLToPath(new URL('../../scripts/preflight-policy.mjs', import.meta.url));
  const result = spawnSync(process.execPath, [script], { input: 'INERT_CANARY', encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.ok(!result.stderr.includes('INERT_CANARY'));
});
test('read-only host collector has no provisioning/start/reset/secret-reading commands', () => {
  const source = readFileSync(new URL('../../scripts/preflight.ps1', import.meta.url), 'utf8');
  assert.match(source, /docker info/);
  assert.match(source, /docker compose version/);
  assert.doesNotMatch(source, /docker\s+(?:pull|run|build|start|stop|system|volume)|compose\s+(?:up|down|pull|build)|Get-Content|supabase\s+(?:start|db)/i);
});
