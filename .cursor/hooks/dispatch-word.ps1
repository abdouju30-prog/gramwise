# Routes a single-word user prompt to .cursor/hooks/words/<word>.ps1
. "$PSScriptRoot\words\_common.ps1"

$raw = [Console]::In.ReadToEnd()
if ([string]::IsNullOrWhiteSpace($raw)) { Emit-Continue; exit 0 }

try { $input = $raw | ConvertFrom-Json } catch { Emit-Continue; exit 0 }

$prompt = ($input.prompt -as [string]).Trim()
if ($prompt -match '\s') { Emit-Continue; exit 0 }

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
