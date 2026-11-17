param(
    [Parameter(Mandatory = $true)][string]$DockerDataPath,
    [Parameter(Mandatory = $true)][string]$RunId
)
$ErrorActionPreference = 'Stop'
if ($RunId -notmatch '^[a-z0-9-]+$') { throw 'Invalid run identifier.' }
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$images = Get-Content (Join-Path $root 'infra/image-proposal.json') -Raw | ConvertFrom-Json
$profile = Get-Content (Join-Path $root 'infra/demo-lite.json') -Raw | ConvertFrom-Json
if ($images.status -ne 'owner-approved' -or $profile.status -ne 'owner-approved') { throw 'Approval missing.' }
$nodes = @(Get-CimInstance Win32_Process -Filter "Name='node.exe'")
if ($nodes.Count -gt 0) { throw 'Windows Node processes present: classify/stop duplicates explicitly before this controlled build.' }
$preflight = & (Join-Path $PSScriptRoot 'preflight.ps1') -DockerDataPath $DockerDataPath -Profile demo-lite -Phase build | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $preflight.status -ne 'pass') { throw 'Budget preflight blocked.' }
$running = @(& docker ps --quiet)
if ($LASTEXITCODE -ne 0 -or $running.Count -gt 0) { throw 'Controlled build requires no running containers; no existing containers were stopped.' }
$output = Join-Path $root "reports/$RunId"
if (Test-Path -LiteralPath $output) { throw 'Run output exists; refusing overwrite.' }
New-Item -ItemType Directory -Path $output | Out-Null
$preflight | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $output 'preflight.json') -Encoding UTF8
$reference = "$($images.node.reference)@$($images.node.indexDigest)"
& docker pull --platform linux/amd64 $reference
if ($LASTEXITCODE -ne 0) { throw 'Approved Node image pull failed.' }
$name = "gmf64-build-$RunId"
$cap = "$($profile.budget.buildContainerMiB)m"
& docker run --detach --name $name --label io.grabmefood.task=SCRUM-64 --platform linux/amd64 --memory $cap --memory-swap $cap --cpus 2 --mount "type=bind,source=$root,target=/source,readonly" $reference bash /source/scripts/build-bounded.sh | Out-Null
if ($LASTEXITCODE -ne 0) { throw 'Bounded build container did not start.' }
& (Join-Path $PSScriptRoot 'measure-local.ps1') -Container $name -OutputDirectory $output
Start-Process -FilePath docker -ArgumentList @('logs', $name) -Wait -NoNewWindow -RedirectStandardOutput (Join-Path $output 'build.stdout.log') -RedirectStandardError (Join-Path $output 'build.stderr.log')
$state = (& docker inspect --format '{{json .State}}' $name) | ConvertFrom-Json
$state | Select-Object Status,ExitCode,OOMKilled,Error,StartedAt,FinishedAt | ConvertTo-Json | Set-Content (Join-Path $output 'state.json') -Encoding UTF8
if ($state.ExitCode -ne 0 -or $state.OOMKilled) { throw "Bounded build failed; inspect reports/$RunId/build.stdout.log and build.stderr.log. No retry/cap reduction or cleanup attempted." }
$artifacts = Join-Path $root "reports/runtime-artifacts-$RunId"
New-Item -ItemType Directory -Path $artifacts | Out-Null
& docker cp "${name}:/artifacts/." $artifacts
if ($LASTEXITCODE -ne 0) { throw 'Cannot export Linux tar artifacts.' }
$artifacts | Set-Content (Join-Path $output 'artifact-path.txt') -Encoding UTF8
Write-Output "Bounded build complete; artifacts: $artifacts . Test container retained stopped; no data deleted."
