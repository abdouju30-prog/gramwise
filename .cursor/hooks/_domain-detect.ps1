# Domain auto-detection from docs/intent-map.json (dot-source only)

function Get-ProjectRootFromHooks {
    $dir = $PSScriptRoot
    while ($dir) {
        if (Test-Path (Join-Path $dir 'docs\intent-map.json')) { return $dir }
        $parent = Split-Path $dir -Parent
        if ($parent -eq $dir) { break }
        $dir = $parent
    }
    return $null
}

function Normalize-SlicePath([string]$p) {
    return ($p -replace '\\', '/').ToLowerInvariant()
}

function Get-DomainScore($domain, [string]$text, $attachments) {
    $score = 0
    foreach ($kw in $domain.keywords) {
        if ($text.Contains($kw.ToLowerInvariant())) { $score += 2 }
    }
    $fileNorm = Normalize-SlicePath $domain.file
    foreach ($att in $attachments) {
        $fp = Normalize-SlicePath ($att.file_path -as [string])
        if ([string]::IsNullOrWhiteSpace($fp)) { continue }
        if ($fp.Contains($fileNorm.TrimEnd('/'))) { $score += 50 }
        foreach ($root in $domain.code_roots) {
            if ([string]::IsNullOrWhiteSpace($root)) { continue }
            $r = Normalize-SlicePath $root
            if ($fp.Contains($r.TrimEnd('/'))) { $score += 30 }
        }
    }
    return $score
}

function Select-DomainFromPrompt($inputObj) {
    $root = Get-ProjectRootFromHooks
    if (-not $root) { return $null }

    $mapPath = Join-Path $root 'docs\intent-map.json'
    if (-not (Test-Path -LiteralPath $mapPath)) { return $null }

    $map = Get-Content -LiteralPath $mapPath -Raw -Encoding utf8 | ConvertFrom-Json
    $text = ($inputObj.prompt -as [string]).ToLowerInvariant()
    $attachments = @()
    if ($inputObj.attachments) { $attachments = @($inputObj.attachments) }

    $best = $null
    $bestScore = 0
    foreach ($d in $map.domains) {
        $s = Get-DomainScore $d $text $attachments
        if ($s -gt $bestScore) {
            $bestScore = $s
            $best = $d
        }
    }
    if ($bestScore -lt 2) { return $null }
    return $best
}

function Build-AutoDomainContext($domain) {
    $codeHint = if ($domain.code_roots -and @($domain.code_roots).Count -gt 0) {
        "Code roots: $(@($domain.code_roots) -join ', ')."
    } else { "Grep code only if the task requires implementation." }

    return @"
[AUTO-DOMAIN: $($domain.id)]
Slice (read + edit ONLY): $($domain.file)
$codeHint
Do not open other docs/domains/* or PROJECT_BRIEF. One slice, minimal reply, no doc noise.
"@
}

function Invoke-AutoDomainDetect($inputObj) {
    $domain = Select-DomainFromPrompt $inputObj
    if ($null -eq $domain) { return }
    . "$PSScriptRoot\words\_common.ps1"
    Set-WordContext (Build-AutoDomainContext $domain)
}
