// Container health is process liveness ONLY, not Cloud/business readiness.
const port = Number(process.env.PORT);
const path = process.env.HEALTH_PATH;
if (!Number.isInteger(port) || port < 1024 || port > 65535 ||
    !['/health/live', '/api/health/live'].includes(path)) {
  process.exitCode = 1;
} else {
  try {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { signal: AbortSignal.timeout(2000) });
    const body = await response.json();
    if (response.status !== 200 || body.status !== 'alive' || body.scope !== 'scaffold') process.exitCode = 1;
  } catch {
    process.exitCode = 1;
  }
}
