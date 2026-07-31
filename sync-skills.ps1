param(
    [string]$TargetDir
)

$ErrorActionPreference = "Stop"

$scriptRoot = $PSScriptRoot
if (-not $scriptRoot) { $scriptRoot = "C:\Projects\mp-skills" }

$sourceDir = Join-Path $scriptRoot "skills"
$localAgentsDir = if ($TargetDir) {
    if (Test-Path (Join-Path $TargetDir ".agents")) {
        Join-Path $TargetDir ".agents\skills"
    } else {
        $TargetDir
    }
} else {
    Join-Path $scriptRoot ".agents\skills"
}

Write-Host "Syncing skills to $localAgentsDir..."

If (Test-Path $localAgentsDir) {
    Remove-Item -Recurse -Force "$localAgentsDir\*" -ErrorAction SilentlyContinue
} Else {
    New-Item -ItemType Directory -Path $localAgentsDir -Force | Out-Null
}

# Find all skill directories (directories containing SKILL.md)
$skillFiles = Get-ChildItem -Path $sourceDir -Recurse -Filter "SKILL.md" -File

$count = 0
foreach ($skillFile in $skillFiles) {
    $skillDir = $skillFile.Directory
    $skillName = $skillDir.Name

    $localDest = Join-Path -Path $localAgentsDir -ChildPath $skillName
    Copy-Item -Path $skillDir.FullName -Destination $localDest -Recurse -Force

    $count++
}

Write-Host "Successfully synced $count skills to $localAgentsDir."
Write-Host "Important: Restart or refresh your session for the agent to load project skills."

