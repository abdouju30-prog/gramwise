# Shared helpers — do not read stdin here (dispatch reads once)

function Get-StateDir {
    $dir = Join-Path $PSScriptRoot '..\state'
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    return $dir
}

function Set-WordContext([string]$Text) {
    $path = Join-Path (Get-StateDir) 'inject.md'
    Set-Content -Path $path -Value $Text -Encoding utf8NoBOM
}

function Emit-Continue {
    @{ continue = $true } | ConvertTo-Json -Compress
}
