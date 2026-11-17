param(
    [Parameter(Mandatory = $true)]
    [string]$DockerDataPath,
    # Explicit opt-in to diagnostic scaffold, NOT a functional product demo.
    [switch]$ScaffoldOnly,
    [switch]$Build,
    [switch]$PullApprovedImages
)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$compose = Join-Path $root 'infra/compose.yaml'
$images = Get-Content -LiteralPath (Join-Path $root 'infra/image-proposal.json') -Raw | ConvertFrom-Json
$profile = Get-Content -LiteralPath (Join-Path $root 'infra/demo-lite.json') -Raw | ConvertFrom-Json
if ($images.status -ne 'owner-approved' -or $profile.status -ne 'owner-approved') {
    throw 'Exact image/profile approval missing; no Docker operation attempted.'
}
if (@(Get-CimInstance Win32_Process -Filter "Name='node.exe'").Count -gt 0) {
    throw 'Windows Node processes present; classify duplicates before starting containers. No process was stopped.'
}
function Assert-Preflight([string]$Phase) {
    $output = & (Join-Path $PSScriptRoot 'preflight.ps1') -DockerDataPath $DockerDataPath -Profile demo-lite -Phase $Phase
    $result = $output | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0 -or $result.status -ne 'pass') {
        throw "Resource preflight blocked ($Phase); no further Docker operation attempted."
    }
}
Assert-Preflight 'runtime'
if (-not $ScaffoldOnly) {
    throw 'Full demo blocked: Cloud roles/TLS/provisioning and business readiness have not been verified. No containers started. Use ScaffoldOnly explicitly for diagnostic testing after resource gates pass.'
}
# Caller supplies local-only broker password through their approved secret channel.
# No .env auto-loading, no credential output or remote secret retrieval.
$password = [Environment]::GetEnvironmentVariable('RABBITMQ_DEMO_PASSWORD')
if ([string]::IsNullOrWhiteSpace($password) -or $password.Length -lt 16 -or $password.StartsWith('INERT_')) {
    throw 'Supply a non-canary local broker password (>=16 chars) through the approved local environment; do not paste it into chat/Jira.'
}
$env:COMPOSE_DISABLE_ENV_FILE = '1'
& docker compose -f $compose config --quiet
if ($LASTEXITCODE -ne 0) { throw 'Compose configuration invalid.' }
if ($Build) {
    Assert-Preflight 'build'
    $running = @(& docker compose -f $compose ps --status running --quiet)
    if ($LASTEXITCODE -ne 0 -or $running.Count -gt 0) {
        throw 'Cannot build while this demo stack is running. No processes were stopped.'
    }
    $runId = 'entry-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
    & (Join-Path $PSScriptRoot 'build-bounded.ps1') -DockerDataPath $DockerDataPath -RunId $runId
    $env:GMF_ARTIFACT_DIR = (Get-Content (Join-Path $root "reports/$runId/artifact-path.txt") -Raw).Trim()
}
if ($PullApprovedImages) {
    foreach ($name in @('node', 'rabbitmq')) {
        $entry = $images.$name
        & docker pull --platform linux/amd64 "$($entry.reference)@$($entry.indexDigest)"
        if ($LASTEXITCODE -ne 0) { throw 'Approved image pull failed; no containers started.' }
    }
}
if ($Build) {
    # Heavy Node compilation already finished in the single capped Linux builder.
    # Separate commands assemble Linux tar artifacts; no Node RUN/build in Dockerfile.
    foreach ($service in @('gateway', 'catalog', 'community', 'notification', 'web')) {
        Assert-Preflight 'build'
        & docker compose -f $compose build $service
        if ($LASTEXITCODE -ne 0) { throw "Image build failed for $service; no containers started." }
    }
}
if ([string]::IsNullOrWhiteSpace($env:GMF_ARTIFACT_DIR)) {
    throw 'Specify artifact directory from the bounded Linux build; host Windows artifacts are not accepted.'
}
Assert-Preflight 'runtime'
& docker compose -f $compose up -d --no-build --pull never --wait --wait-timeout 180
if ($LASTEXITCODE -ne 0) { throw 'Scaffold startup failed; inspect only this stack. No reset/delete/automatic cleanup was attempted.' }
Write-Output 'Diagnostic scaffold only: http://localhost:3000 . Container health is liveness, not Cloud/business readiness.'
Write-Output 'Business readiness remains503/not-implemented. Full demo acceptance is NOT achieved.'
