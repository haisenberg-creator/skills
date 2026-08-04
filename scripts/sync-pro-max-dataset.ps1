param(
    [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $PSScriptRoot
if (-not $scriptRoot) { $scriptRoot = "C:\Projects\mp-skills" }

$targetSkillDir = Join-Path $scriptRoot "skills\engineering\pro-max-design-system"
$tempZipPath = Join-Path ([System.IO.Path]::GetTempPath()) "ui-ux-pro-max-skill.zip"
$tempExtractPath = Join-Path ([System.IO.Path]::GetTempPath()) "ui-ux-pro-max-skill-temp"

Write-Host "Downloading nextlevelbuilder/ui-ux-pro-max-skill ($Branch branch)..."
$zipUrl = "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/archive/refs/heads/$Branch.zip"

Invoke-WebRequest -Uri $zipUrl -OutFile $tempZipPath

If (Test-Path $tempExtractPath) {
    Remove-Item -Recurse -Force $tempExtractPath
}

Write-Host "Extracting archive..."
Expand-Archive -Path $tempZipPath -DestinationPath $tempExtractPath -Force

$extractedRootDir = Get-ChildItem -Path $tempExtractPath | Select-Object -First 1

# Source locations within extracted repo
$srcData = Join-Path $extractedRootDir.FullName "data"
if (-not (Test-Path $srcData)) {
    $srcData = Join-Path $extractedRootDir.FullName "src\ui-ux-pro-max\data"
}

$srcScripts = Join-Path $extractedRootDir.FullName "scripts"
if (-not (Test-Path $srcScripts)) {
    $srcScripts = Join-Path $extractedRootDir.FullName "src\ui-ux-pro-max\scripts"
}

# Copy to target skill dir
If (Test-Path $srcData) {
    $destData = Join-Path $targetSkillDir "data"
    Write-Host "Copying data folder to $destData..."
    If (-not (Test-Path $destData)) { New-Item -ItemType Directory -Path $destData -Force | Out-Null }
    Copy-Item -Path "$srcData\*" -Destination $destData -Recurse -Force
} Else {
    Write-Warning "Could not locate data directory in downloaded archive."
}

If (Test-Path $srcScripts) {
    $destScripts = Join-Path $targetSkillDir "scripts"
    Write-Host "Copying scripts folder to $destScripts..."
    If (-not (Test-Path $destScripts)) { New-Item -ItemType Directory -Path $destScripts -Force | Out-Null }
    Copy-Item -Path "$srcScripts\*" -Destination $destScripts -Recurse -Force
} Else {
    Write-Warning "Could not locate scripts directory in downloaded archive."
}

# Cleanup
Remove-Item -Path $tempZipPath -Force -ErrorAction SilentlyContinue
Remove-Item -Recurse -Path $tempExtractPath -Force -ErrorAction SilentlyContinue

Write-Host "Successfully synced ui-ux-pro-max dataset and scripts to $targetSkillDir."
