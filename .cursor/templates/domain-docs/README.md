# Domain-docs skeleton (any project)

Split project knowledge into **small files by domain**. Cursor reads `docs/DOMAINS.md` first, then **one** slice — not the whole brief.

## Bootstrap a new repo

From project root (PowerShell):

```powershell
$tpl = ".cursor/templates/domain-docs"
New-Item -ItemType Directory -Force -Path docs/domains | Out-Null
Copy-Item "$tpl/docs/DOMAINS.md" docs/DOMAINS.md
Copy-Item "$tpl/docs/domains/*" docs/domains/
Copy-Item "$tpl/.cursor/rules/domain-docs-slice.mdc" .cursor/rules/domain-docs-slice.mdc -Force
Copy-Item "$tpl/PROJECT_BRIEF.index.md" PROJECT_BRIEF.md
# Optional one-word hooks (bonjour, go, fin, …)
Copy-Item -Recurse "$tpl/hooks" .cursor/hooks -Force
Copy-Item "$tpl/hooks.json" .cursor/hooks.json
Copy-Item "$tpl/workflow-words.mdc" .cursor/rules/workflow-words.mdc
Copy-Item "$tpl/hooks/before-prompt.ps1" .cursor/hooks/before-prompt.ps1
Copy-Item "$tpl/hooks/_domain-detect.ps1" .cursor/hooks/_domain-detect.ps1
Copy-Item "$tpl/hooks/inject-word-context.ps1" .cursor/hooks/inject-word-context.ps1 -ErrorAction SilentlyContinue
Copy-Item -Recurse "$tpl/hooks/words" .cursor/hooks/words -Force
Copy-Item "$tpl/docs/intent-map.json" docs/intent-map.json
```

Then:

1. Fill each `docs/domains/*.md` (replace `<!-- TODO -->`).
2. Adjust rows in `docs/DOMAINS.md` (paths + keywords).
3. Point `PROJECT_BRIEF.md` to the manifest only.

## Optional: user-wide rule

Copy `domain-docs-slice.mdc` to `%USERPROFILE%\.cursor\rules\` so **every** workspace gets slice discipline (or rely on per-repo copy above).

## File layout

```
docs/
  DOMAINS.md              # manifest only — agent reads this first
  domains/
    01-context.md         # problem, identity, why
    02-scope.md           # IN/OUT, version scope
    03-product.md         # spec (or link ../PRODUCT_SPEC.md)
    04-architecture.md    # stack, modules
    05-formulas.md        # business rules / math
    06-test-cases.md      # regression references
    07-tasks.md           # or link ../TODO.md
    08-workflow.md        # session commands, handoff
    09-diagrams.md        # Mermaid
    10-business.md        # pricing, GTM, metrics
PROJECT_BRIEF.md          # index only — no body
.cursor/rules/
  domain-docs-slice.mdc   # alwaysApply
```

## Agent workflow (token discipline)

1. **Detect** — `docs/DOMAINS.md` + user message / `@` file
2. **Open** — one domain file (+ code if implementing)
3. **Edit** — that slice + code only
4. **Close** — do not re-read other domains

Ship with `project-end-compress.mdc` + `session-fin-handoff-block.mdc` from GramWise for session end.
