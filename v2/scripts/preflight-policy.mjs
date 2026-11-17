import { pathToFileURL } from 'node:url';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

const demoLite = JSON.parse(readFileSync(new URL('../infra/demo-lite.json', import.meta.url), 'utf8'));

// Approved provisional host guards, not measured full-workload guarantees.
export const thresholds = Object.freeze({
  usableRamGiB: 15, freeRamGiB: 6, dockerDataFreeGiB: 15, workspaceFreeGiB: 10,
});
export const localPorts = Object.freeze([3000, 3001, 3002, 3003, 3004, 5672, 15672]);

export function evaluatePreflight(input, { profile = 'full', phase = 'build' } = {}) {
  if (!['full', 'demo-lite'].includes(profile) || !['build', 'runtime'].includes(phase)) {
    throw new Error('Unsupported preflight profile or phase');
  }
  if (profile === 'demo-lite' && demoLite.status !== 'owner-approved') {
    throw new Error('Profile approval missing');
  }
  const budget = demoLite.budget;
  const requiredMiB = profile === 'demo-lite'
    ? budget.windowsReserveMiB + budget.incrementalVmAllowanceMiB +
      (phase === 'build' ? budget.buildContainerMiB : budget.runtimeContainersMiB)
    : thresholds.freeRamGiB * 1024;
  const selectedThresholds = {
    ...thresholds,
    freeRamGiB: requiredMiB / 1024,
  };
  const checks = [];
  for (const [name, minimum] of Object.entries(selectedThresholds)) {
    const actual = input[name];
    checks.push({
      name, minimum, actual: Number.isFinite(actual) && actual >= 0 ? actual : null,
      status: !Number.isFinite(actual) || actual < 0 ? 'unknown' : actual >= minimum ? 'pass' : 'blocked',
    });
  }
  checks.push({ name: 'dockerEngine', status: input.dockerEngineReachable === true ? 'pass' : 'blocked' });
  checks.push({ name: 'dockerLinux', status: input.dockerOsType === 'linux' ? 'pass' : 'blocked' });
  checks.push({ name: 'compose', status: input.composeAvailable === true ? 'pass' : 'blocked' });
  if (profile === 'demo-lite') {
    const minimum = (phase === 'build' ? budget.buildContainerMiB : budget.runtimeContainersMiB) + budget.incrementalVmAllowanceMiB;
    checks.push({ name: 'dockerVmCapacityMiB', minimum,
      actual: Number.isFinite(input.dockerMemoryMiB) ? input.dockerMemoryMiB : null,
      status: Number.isFinite(input.dockerMemoryMiB) && input.dockerMemoryMiB >= minimum ? 'pass' : 'blocked',
      scope: 'VM capacity only, not Windows available or Linux MemAvailable' });
  }
  for (const port of localPorts) {
    checks.push({ name: `port:${port}`, status: input.ports?.[port] === true ? 'pass' : 'blocked' });
  }
  return {
    scope: 'local-host-only',
    profile,
    phase,
    status: checks.every(check => check.status === 'pass') ? 'pass' : 'blocked',
    checks,
    cloud: { status: 'not-verified', reason: 'No Cloud calls, credentials, quotas or TLS probes in this check.' },
    imageApproval: 'separate-owner-gate',
    ...(profile === 'demo-lite' ? {
      budget: { requiredAvailableMiB: requiredMiB, windowsReserveMiB: budget.windowsReserveMiB,
        incrementalVmAllowanceMiB: budget.incrementalVmAllowanceMiB,
        workloadCapMiB: phase === 'build' ? budget.buildContainerMiB : budget.runtimeContainersMiB,
        swapAsRam: false, buildMode: 'single-capped-linux-container' },
      containerLimits: { status: 'declared-not-runtime-verified', memoryMiB: { ...demoLite.containerMemoryMiB } },
    } : {}),
    note: 'Point-in-time preflight only; not application readiness or permission to pull/start.',
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    let text = '';
    for await (const chunk of process.stdin) text += chunk;
    const { values } = parseArgs({
      options: {
        profile: { type: 'string', default: 'full' },
        phase: { type: 'string', default: 'build' },
      },
      strict: true,
      allowPositionals: false,
    });
    const report = evaluatePreflight(JSON.parse(text), values);
    console.log(JSON.stringify(report, null, 2));
    process.exitCode = report.status === 'pass' ? 0 : 2;
  } catch {
    // Never echo arbitrary input or raw tool output.
    console.error('Preflight input invalid; no startup was attempted.');
    process.exitCode = 2;
  }
}
