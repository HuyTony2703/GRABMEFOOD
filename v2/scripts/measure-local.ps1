param(
    [Parameter(Mandatory = $true)][string]$Container,
    [Parameter(Mandatory = $true)][string]$OutputDirectory,
    [int]$MaxSeconds = 900
)
$ErrorActionPreference = 'Stop'
$start = Get-Date
$measurements = @()
$aborted = $false
do {
    $stateText = & docker inspect --format '{{json .State}}' $Container
    if ($LASTEXITCODE -ne 0) { throw 'Cannot inspect exact test container.' }
    $state = $stateText | ConvertFrom-Json
    $os = Get-CimInstance Win32_OperatingSystem
    $vm = @(Get-Process -Name '*vmmem*' -ErrorAction SilentlyContinue)
    $stats = & docker stats --no-stream --format '{{json .}}' $Container 2>$null
    $measurements += [pscustomobject]@{
        At=(Get-Date -Format o)
        AvailableMiB=$os.FreePhysicalMemory/1024
        VmWorkingSetMiB=($vm | Measure-Object WorkingSet64 -Sum).Sum/1MB
        ContainerStats=($stats -join '')
        Status=$state.Status
        OOMKilled=$state.OOMKilled
    }
    if (-not $state.Running) { break }
    if ($os.FreePhysicalMemory/1024 -lt 1024 -or ((Get-Date)-$start).TotalSeconds -gt $MaxSeconds) {
        $aborted = $true
        # Safety stop is scoped to our named experimental container, never host apps/data.
        & docker stop --timeout 30 $Container | Out-Null
        break
    }
    Start-Sleep -Seconds 1
} while ($true)
$measurements | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $OutputDirectory 'measurements.json') -Encoding UTF8
$summary = [pscustomobject]@{
    Container=$Container
    Samples=$measurements.Count
    MinWindowsAvailableMiB=($measurements | Measure-Object AvailableMiB -Minimum).Minimum
    MaxVmWorkingSetMiB=($measurements | Measure-Object VmWorkingSetMiB -Maximum).Maximum
    Aborted=$aborted
}
$summary | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $OutputDirectory 'summary.json') -Encoding UTF8
$summary | Format-List
if ($aborted) { throw 'Budget safety stop: host reserve or experiment timeout exceeded.' }
