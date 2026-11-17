import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const bash = readFileSync(new URL('../../scripts/build-bounded.sh', import.meta.url), 'utf8');
const runner = readFileSync(new URL('../../scripts/build-bounded.ps1', import.meta.url), 'utf8');
test('noninteractive production deploy inherits CI and ignored lifecycle policy', () => {
  assert.match(bash, /export CI=true/);
  assert.match(bash, /npm_config_ignore_scripts=true/);
});
test('all compilation finishes before deploy may prune temporary workspace dev dependencies', () => {
  const build = bash.indexOf('pnpm -r --workspace-concurrency=1 build');
  assert.ok(build >= 0);
  assert.ok(build < bash.indexOf('deploy --prod --legacy'));
});
test('native stderr notices are captured separately without becoming PowerShell terminating errors', () => {
  assert.match(runner, /Start-Process.*-RedirectStandardOutput.*-RedirectStandardError/);
  assert.doesNotMatch(runner, /& docker logs.*2>&1/);
});
test('cached build retries deploy into fresh attempt directories without deleting prior output', () => {
  assert.match(bash, /deployRoot=.*attempt-/);
  assert.match(bash, /"\$deployRoot\/\$service"/);
  assert.doesNotMatch(bash, /"\/deploy\/\$service"|rm -rf/);
});
