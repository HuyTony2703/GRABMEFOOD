param(
    [Parameter(Mandatory = $true)][string]$DockerDataPath,
    [Parameter(Mandatory = $true)][string]$ArtifactDirectory,
    [Parameter(Mandatory = $true)][string]$RunId
)
$ErrorActionPreference = 'Stop'
if ($RunId -notmatch '^[a-z0-9-]+$') { throw 'Invalid test RunId.' }
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$compose = Join-Path $root 'infra/compose.yaml'
$project = "gmf64-$RunId"
$out = Join-Path $root "reports/$RunId"
if (Test-Path $out) { throw 'Existing report directory; refusing overwrite.' }
if (@(& docker ps --all --quiet --filter "label=com.docker.compose.project=$project").Count -gt 0) {
    throw 'Test project already exists; refusing to touch existing containers/data.'
}
if (@(Get-CimInstance Win32_Process -Filter "Name='node.exe'").Count -gt 0) {
    throw 'Windows Node processes present; classify duplicates before test.'
}
$pf = & (Join-Path $PSScriptRoot 'preflight.ps1') -Profile demo-lite -Phase runtime -DockerDataPath $DockerDataPath | ConvertFrom-Json
if ($pf.status -ne 'pass') { throw 'Runtime budget preflight blocked.' }
New-Item -ItemType Directory -Path $out | Out-Null
$pf | ConvertTo-Json -Depth 10 | Set-Content (Join-Path $out 'preflight.json')
$env:GMF_ARTIFACT_DIR = (Resolve-Path $ArtifactDirectory).Path
$env:COMPOSE_PROJECT_NAME = $project
$env:COMPOSE_DISABLE_ENV_FILE = '1'
# Only a NEW local test-broker password; no existing credential reads or secret logs/files.
$bytes = New-Object byte[] 32
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:RABBITMQ_DEMO_PASSWORD = [Convert]::ToBase64String($bytes)
Add-Type -AssemblyName System.Net.Http
$http = New-Object System.Net.Http.HttpClient
$http.Timeout = [TimeSpan]::FromSeconds(5)
$broker = New-Object System.Net.Http.HttpClient
$broker.Timeout = [TimeSpan]::FromSeconds(5)
$basic = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("gmf_demo:$($env:RABBITMQ_DEMO_PASSWORD)"))
$broker.DefaultRequestHeaders.Authorization = [System.Net.Http.Headers.AuthenticationHeaderValue]::new('Basic', $basic)
$samples = New-Object System.Collections.Generic.List[object]
$checks = New-Object System.Collections.Generic.List[object]
function Sample([string]$Phase) {
    $os = Get-CimInstance Win32_OperatingSystem
    $vm = @(Get-Process -Name '*vmmem*' -ErrorAction SilentlyContinue)
    $ids = @(& docker ps --quiet --filter "label=com.docker.compose.project=$project")
    $stats = @()
    if ($ids.Count -gt 0) {
        $raw = @(& docker stats --no-stream --format '{{json .}}' $ids)
        $stats = @($raw | ForEach-Object { $_ | ConvertFrom-Json })
    }
    $samples.Add([pscustomobject]@{At=(Get-Date -Format o);Phase=$Phase;AvailableMiB=$os.FreePhysicalMemory/1024;
        VmWSMiB=($vm | Measure-Object WorkingSet64 -Sum).Sum/1MB;Stats=$stats})
    if ($os.FreePhysicalMemory/1024 -lt 1024) { throw 'Host available below 1GiB reserve; stopping only this test project.' }
}
function Run-Observed([string]$Phase, [string]$File, [string[]]$Arguments) {
    $process = Start-Process -FilePath $File -ArgumentList $Arguments -PassThru -NoNewWindow -RedirectStandardOutput (Join-Path $out "$Phase.stdout.log") -RedirectStandardError (Join-Path $out "$Phase.stderr.log")
    $null = $process.Handle
    do {
        Sample $Phase
        if ($process.HasExited) { break }
        Start-Sleep -Seconds 1
    } while ($true)
    $process.WaitForExit()
    if ($null -eq $process.ExitCode -or $process.ExitCode -ne 0) { throw "$Phase failed; see phase logs (no credentials echoed)." }
}
function Get-Local([string]$Path) {
    $response = $http.GetAsync($Path).Result
    if ($null -eq $response) { throw 'Local HTTP connection failed.' }
    return [pscustomobject]@{Status=[int]$response.StatusCode;Body=$response.Content.ReadAsStringAsync().Result}
}
function Smoke([string]$Phase) {
    foreach ($entry in @(@('web',3000,'/api/health'),@('gateway',3001,'/health'),@('catalog',3002,'/health'),@('community',3003,'/health'),@('notification',3004,'/health'))) {
        $name = $entry[0]; $base = "http://127.0.0.1:$($entry[1])"
        $live = Get-Local "$base$($entry[2])/live"
        $body = $live.Body | ConvertFrom-Json
        if ($live.Status -ne 200 -or $body.service -ne $name -or $body.status -ne 'alive') { throw "Invalid liveness $name." }
        $ready = Get-Local "$base$($entry[2])/ready"
        if ($ready.Status -ne 503 -or ($ready.Body | ConvertFrom-Json).checks[0].status -ne 'not-implemented') { throw "Readiness must honestly remain unavailable for $name." }
        if ((Get-Local "$base/api/v1/me").Status -ne 404) { throw "Unexpected business endpoint $name." }
        $checks.Add([pscustomobject]@{Phase=$Phase;Service=$name;Live=200;Ready=503;Business=404})
    }
    $page = Get-Local 'http://127.0.0.1:3000/'
    if ($page.Status -ne 200 -or -not $page.Body.Contains('GrabMeFood V2')) { throw 'Diagnostic Web page failed.' }
}
function Broker-Request([string]$Method, [string]$Path, [string]$Json) {
    if ($Method -eq 'GET') { $response = $broker.GetAsync("http://127.0.0.1:15672$Path").Result }
    else {
        $content = [System.Net.Http.StringContent]::new($Json, [Text.Encoding]::UTF8, 'application/json')
        if ($Method -eq 'PUT') { $response = $broker.PutAsync("http://127.0.0.1:15672$Path", $content).Result }
        else { $response = $broker.PostAsync("http://127.0.0.1:15672$Path", $content).Result }
    }
    if ($null -eq $response -or -not $response.IsSuccessStatusCode) { throw 'Local test broker request failed (no credential output).' }
    return $response.Content.ReadAsStringAsync().Result
}
try {
    $images = Get-Content (Join-Path $root 'infra/image-proposal.json') -Raw | ConvertFrom-Json
    if ($images.status -ne 'owner-approved') { throw 'Image approval missing.' }
    $rabbit = "$($images.rabbitmq.reference)@$($images.rabbitmq.indexDigest)"
    Run-Observed 'broker-pull' 'docker' @('pull','--platform','linux/amd64',$rabbit)
    Run-Observed 'startup' 'powershell.exe' @('-NoProfile','-File',(Join-Path $PSScriptRoot 'start-demo.ps1'),'-DockerDataPath',$DockerDataPath,'-ScaffoldOnly')
    Smoke 'all-six-started'
    $until = (Get-Date).AddSeconds(60)
    do { Sample 'all-six-stability'; Smoke 'all-six-stability'; Start-Sleep -Seconds 3 } while ((Get-Date) -lt $until)
    $null = Broker-Request 'PUT' '/api/queues/%2F/gmf64_persistence' '{"durable":true,"auto_delete":false,"arguments":{}}'
    $published = Broker-Request 'POST' '/api/exchanges/%2F/amq.default/publish' '{"properties":{"delivery_mode":2},"routing_key":"gmf64_persistence","payload":"INERT_GMF64_PERSISTENCE_CANARY","payload_encoding":"string"}'
    if (-not ($published | ConvertFrom-Json).routed) { throw 'Test message was not routed.' }
    $beforeStop = @()
    foreach ($id in @(& docker ps --quiet --filter "label=com.docker.compose.project=$project")) {
        $state = (& docker inspect --format '{"name":{{json .Name}},"oom":{{json .State.OOMKilled}},"restarts":{{.RestartCount}},"health":{{json .State.Health.Status}}}' $id) | ConvertFrom-Json
        if ($state.oom -or $state.restarts -ne 0 -or $state.health -ne 'healthy') { throw 'Pre-stop runtime health/OOM/restart failure.' }
        $peak = & docker exec $id cat /sys/fs/cgroup/memory.peak
        $state | Add-Member -NotePropertyName CgroupPeakBytes -NotePropertyValue ($peak -join '')
        $beforeStop += $state
    }
    if ($beforeStop.Count -ne 6) { throw 'Expected six containers before stop.' }
    $beforeStop | ConvertTo-Json | Set-Content (Join-Path $out 'containers-before-stop.json')
    Run-Observed 'stop' 'docker' @('compose','-p',$project,'-f',$compose,'stop','--timeout','30')
    $stopped = @(& docker ps --quiet --filter "label=com.docker.compose.project=$project")
    if ($stopped.Count -ne 0) { throw 'Project did not stop cleanly.' }
    Run-Observed 'restart' 'docker' @('compose','-p',$project,'-f',$compose,'start','--wait','--wait-timeout','120')
    Smoke 'after-restart'
    $messages = @(Broker-Request 'POST' '/api/queues/%2F/gmf64_persistence/get' '{"count":1,"ackmode":"ack_requeue_true","encoding":"auto","truncate":256}' | ConvertFrom-Json)
    if ($messages.Count -ne 1 -or $messages[0].payload -ne 'INERT_GMF64_PERSISTENCE_CANARY') { throw 'Durable message did not survive stop/start.' }
    $ids = @(& docker ps --quiet --filter "label=com.docker.compose.project=$project")
    if ($ids.Count -ne 6) { throw 'Expected all six containers simultaneously running.' }
    $states = @()
    foreach ($id in $ids) {
        $selected = (& docker inspect --format '{"name":{{json .Name}},"oom":{{json .State.OOMKilled}},"restarts":{{.RestartCount}},"memory":{{.HostConfig.Memory}},"memorySwap":{{.HostConfig.MemorySwap}},"health":{{json .State.Health.Status}}}' $id) | ConvertFrom-Json
        if ($selected.oom -or $selected.restarts -ne 0 -or $selected.health -ne 'healthy' -or $selected.memory -ne $selected.memorySwap) { throw 'OOM/restart/health/swap failure.' }
        $peak = & docker exec $id cat /sys/fs/cgroup/memory.peak
        $selected | Add-Member -NotePropertyName CgroupPeakBytes -NotePropertyValue ($peak -join '')
        $states += $selected
    }
    $states | ConvertTo-Json | Set-Content (Join-Path $out 'containers.json')
    [pscustomobject]@{Project=$project;SimultaneousContainers=6;StabilitySeconds=60;Persistence='pass';Scope='scaffold-not-Cloud-or-product';Status='pass'} | ConvertTo-Json | Set-Content (Join-Path $out 'result.json')
    Write-Output 'PASS: six simultaneous healthy scaffold containers, smoke200/503/404, 60s window, stop/start, durable broker message. Cloud/business unverified.'
} finally {
    $samples | ConvertTo-Json -Depth 8 | Set-Content (Join-Path $out 'measurements.json')
    $checks | ConvertTo-Json | Set-Content (Join-Path $out 'http-checks.json')
    # Leave data/container definitions intact. Only gracefully stop our fresh test project.
    $stop = Start-Process -FilePath docker -ArgumentList @('compose','-p',$project,'-f',$compose,'stop','--timeout','30') -Wait -PassThru -NoNewWindow -RedirectStandardOutput (Join-Path $out 'final-stop.stdout.log') -RedirectStandardError (Join-Path $out 'final-stop.stderr.log')
    if ($stop.ExitCode -ne 0) { Write-Warning 'Test project may still be running; no forced cleanup attempted.' }
    $http.Dispose(); $broker.Dispose()
    $env:RABBITMQ_DEMO_PASSWORD = $null
}
