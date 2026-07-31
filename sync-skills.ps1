$ErrorActionPreference = "Stop"

$sourceDir = "C:\Projects\mp-skills\skills"
$globalConfigDir = "C:\Users\USER\.gemini\config\skills"
$localAgentsDir = "C:\Projects\mp-skills\.agents\skills"

Write-Host "Syncing skills..."

# Remove existing skills from global config and local .agents
If (Test-Path $globalConfigDir) {
    Remove-Item -Recurse -Force "$globalConfigDir\*" -ErrorAction SilentlyContinue
} Else {
    New-Item -ItemType Directory -Path $globalConfigDir -Force | Out-Null
}

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

    # Skip if it's not a direct subfolder of a category or something
    # Actually, we can just copy the folder itself
    $globalDest = Join-Path -Path $globalConfigDir -ChildPath $skillName
    $localDest = Join-Path -Path $localAgentsDir -ChildPath $skillName

    Copy-Item -Path $skillDir.FullName -Destination $globalDest -Recurse -Force
    Copy-Item -Path $skillDir.FullName -Destination $localDest -Recurse -Force

    $count++
}

Write-Host "Successfully synced $count skills to global config and local .agents directory."
Write-Host "Important: Antigravity may require a fresh session to load newly installed skills into the agent's system prompt."
