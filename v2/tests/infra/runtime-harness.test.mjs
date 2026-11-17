import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const source = readFileSync(new URL('../../scripts/runtime-smoke.ps1', import.meta.url), 'utf8');
test('runtime harness requires a fresh scoped project, resource guard and no duplicate host Node', () => {
  assert.match(source, /Test project already exists/);
  assert.match(source, /Windows Node processes present/);
  assert.match(source, /Runtime budget preflight blocked/);
  assert.match(source, /RandomNumberGenerator/);
  assert.doesNotMatch(source, /Remove-Item|docker\s+(?:rm|kill|system|volume)|Stop-Process|compose.*down/);
});
test('runtime harness verifies all six, honest readiness, persistence and scoped graceful stop', () => {
  assert.match(source, /AddSeconds\(60\)/);
  assert.match(source, /\$ids\.Count -ne 6/);
  assert.match(source, /\$ready\.Status -ne 503/);
  assert.match(source, /ack_requeue_true/);
  assert.match(source, /containers-before-stop\.json/);
  assert.match(source, /CgroupPeakBytes/);
  assert.match(source, /finally/);
  assert.match(source, /Cloud\/business unverified/);
});
