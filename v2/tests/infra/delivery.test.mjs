import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

test('owner-approved official pins do not override resource or runtime gates', () => {
  const proposal = JSON.parse(readFileSync(new URL('../../infra/image-proposal.json', import.meta.url), 'utf8'));
  assert.equal(proposal.status, 'owner-approved');
  assert.equal(proposal.approval.scope, 'exact image versions and digests only');
  assert.equal(proposal.approval.resourceGateOverride, false);
  assert.ok(proposal.approval.evidence.includes('Tôi duyệt 2 image pins'));
  assert.equal(proposal.platform, 'linux/amd64');
  assert.equal(proposal.node.reference, 'docker.io/library/node:24.16.0-bookworm-slim');
  assert.equal(proposal.rabbitmq.reference, 'docker.io/library/rabbitmq:4.4.0-management');
  assert.equal(proposal.node.indexDigest, 'sha256:2c87ef9bd3c6a3bd4b472b4bec2ce9d16354b0c574f736c476489d09f560a203');
  assert.equal(proposal.rabbitmq.indexDigest, 'sha256:753099a19b577c322117f793f864b3129cbba96d40317221a69d73976e3c843c');
  for (const image of [proposal.node, proposal.rabbitmq]) {
    assert.match(image.indexDigest, /^sha256:[a-f0-9]{64}$/);
    assert.match(image.platformDigest, /^sha256:[a-f0-9]{64}$/);
  }
});
test('default CI is least-privilege, immutable actions and no Cloud/container execution', () => {
  const workflow = readFileSync(new URL('../../../.github/workflows/v2-ci.yml', import.meta.url), 'utf8');
  const actions = [...workflow.matchAll(/uses:\s+(\S+)/g)].map(match => match[1]);
  assert.equal(actions.length, 2);
  for (const action of actions) assert.match(action, /^actions\/(?:checkout|setup-node)@[a-f0-9]{40}$/);
  assert.match(workflow, /permissions:\s+contents: read/);
  assert.match(workflow, /persist-credentials: false/);
  assert.match(workflow, /node-version: '24\.16\.0'/);
  assert.match(workflow, /pnpm@11\.5\.0/);
  assert.match(workflow, /pnpm install --frozen-lockfile --ignore-scripts/);
  assert.match(workflow, /run: pnpm verify/);
  assert.doesNotMatch(workflow, /secrets\.|pull_request_target:|docker\s+(?:pull|build|run)|compose\s+up|supabase\s+start|id-token:\s*write|contents:\s*write/);
});
test('approved demo-lite retains all six containers, exact caps and distinct build/runtime gates', () => {
  const profile = JSON.parse(readFileSync(new URL('../../infra/demo-lite.json', import.meta.url), 'utf8'));
  assert.equal(profile.status, 'owner-approved');
  assert.ok(profile.approvalEvidence.includes('Tôi duyệt profile trên'));
  assert.deepEqual(profile.phaseFreeRamGiB, { build: 4.25, runtime: 4.25 });
  assert.equal(profile.budget.buildContainerMiB, 2048);
  assert.equal(profile.budget.windowsReserveMiB, 1024);
  assert.equal(profile.budget.incrementalVmAllowanceMiB, 1280);
  assert.equal(profile.budget.buildNodeOldSpaceMiB, 768);
  assert.equal(profile.budget.swapAsRam, false);
  assert.deepEqual(profile.containerMemoryMiB, {
    web: 512, gateway: 256, catalog: 256, community: 256, notification: 256, rabbitmq: 512,
  });
  assert.equal(Object.values(profile.containerMemoryMiB).reduce((sum, value) => sum + value, 0), 2048);
  assert.equal(profile.totalContainerMemoryMiB, 2048);
  assert.equal(profile.diskGuardWaived, false);
  assert.equal(profile.buildDuringDemo, false);
  assert.equal(profile.watchers, false);
  assert.equal(profile.runtimeVerified, false);
  assert.equal(profile.localScaffoldVerification.status, 'pass');
  assert.equal(profile.localScaffoldVerification.cloud, 'not-verified');
  assert.equal(profile.localScaffoldVerification.githubCi, 'not-run');
  assert.equal(profile.mode, 'production');
});
