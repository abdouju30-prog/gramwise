# beforeSubmitPrompt: one-word commands + automatic domain slice
. "$PSScriptRoot\words\_common.ps1"
. "$PSScriptRoot\_domain-detect.ps1"

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { Emit-Continue; exit 0 }

try { $input = $raw | ConvertFrom-Json } catch { Emit-Continue; exit 0 }

$prompt = ($input.prompt -as [string]).Trim()
if ([string]::IsNullOrWhiteSpace($prompt)) { Emit-Continue; exit 0 }

# Single-word workflow (bonjour, go, fin, …)
if ($prompt -notmatch '\s') {
    $word = $prompt.ToLower()
    $handler = Join-Path $PSScriptRoot "words\$word.ps1"
    if (Test-Path -LiteralPath $handler) {
        $script:WordMessage = $null
        . $handler
        if ($script:WordMessage) {
            Set-WordContext $script:WordMessage.Trim()
        }
    }
    Emit-Continue
    exit 0
}

# Natural language → auto domain (design, engine, formulas, …)
Invoke-AutoDomainDetect $input

Emit-Continue
