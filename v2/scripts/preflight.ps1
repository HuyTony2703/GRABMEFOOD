param(
    # Owner supplies the EXISTING Windows directory backing Docker Desktop data.
    # Never infer this from Linux /var/lib/docker or read Desktop account settings.
    [string]$DockerDataPath,
    [ValidateSet('full', 'demo-lite')]
    [string]$Profile = 'full',
    [ValidateSet('build', 'runtime')]
    [string]$Phase = 'build'
)

$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$measurement = @{
    dockerEngineReachable = $false
    dockerOsType = 'unknown'
    composeAvailable = $false
    ports = @{}
}

try {
    $os = Get-CimInstance Win32_OperatingSystem
    # Do not round before threshold comparisons.
    $measurement.usableRamGiB = $os.TotalVisibleMemorySize / 1MB
    $measurement.freeRamGiB = $os.FreePhysicalMemory / 1MB
} catch {
    # Missing/failed measurements remain unknown and fail closed.
}

function Get-ExistingPathFreeGiB([string]$Path) {
    if ([string]::IsNullOrWhiteSpace($Path)) { return $null }
    try {
        $item = Get-Item -LiteralPath $Path -ErrorAction Stop
        if (-not $item.PSIsContainer -or $null -eq $item.PSDrive.Free) { return $null }
        return $item.PSDrive.Free / 1GB
    } catch { return $null }
}
$measurement.workspaceFreeGiB = Get-ExistingPathFreeGiB $workspace
$measurement.dockerDataFreeGiB = Get-ExistingPathFreeGiB $DockerDataPath

try {
    $infoText = & docker info --format '{{json .}}' 2>$null
    if ($LASTEXITCODE -eq 0) {
        $info = $infoText | ConvertFrom-Json
        $measurement.dockerEngineReachable = ($null -ne $info.ServerVersion)
        $measurement.dockerOsType = $info.OSType
        $measurement.dockerMemoryMiB = $info.MemTotal / 1MB
    }
    & docker compose version 1>$null 2>$null
    $measurement.composeAvailable = ($LASTEXITCODE -eq 0)
} catch {
    # Do not print raw Docker info (could contain unrelated local configuration).
}

foreach ($port in @(3000, 3001, 3002, 3003, 3004, 5672, 15672)) {
    $listener = $null
    try {
        $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
        $listener.Server.ExclusiveAddressUse = $true
        $listener.Start()
        $measurement.ports["$port"] = $true
    } catch {
        $measurement.ports["$port"] = $false
    } finally {
        if ($null -ne $listener) { $listener.Stop() }
    }
}

# Only the explicit, sanitized numeric/boolean measurements above go to Node.
# This script never reads .env, Cloud credentials or Docker settings.
$measurement | ConvertTo-Json -Depth 4 -Compress | & node (Join-Path $PSScriptRoot 'preflight-policy.mjs') --profile $Profile --phase $Phase
exit $LASTEXITCODE
