# Injects one-shot context after first tool use (beforeSubmitPrompt cannot rewrite prompt)
$stateFile = Join-Path $PSScriptRoot 'state\inject.md'

if (-not (Test-Path -LiteralPath $stateFile)) {
    '{}'
    exit 0
}

$ctx = Get-Content -LiteralPath $stateFile -Raw -Encoding utf8
Remove-Item -LiteralPath $stateFile -Force -ErrorAction SilentlyContinue

@{ additional_context = $ctx.Trim() } | ConvertTo-Json -Compress
exit 0
