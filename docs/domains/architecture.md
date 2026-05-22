# Domain: architecture

> Auto-selected for stack, folders, deploy, module boundaries.

## Current state

- **Engine:** TypeScript `engine/` + Vitest (`npm test`)
- **Docs:** sliced under `docs/domains/` + `docs/DOMAINS.md` manifest
- **App UI:** not scaffolded yet (P0: choose stack)

## Target (draft)

- Next.js App Router recommended in brief
- `engine/` imported as pure module (no LLM in pricing path)
- Deploy: Vercel or similar
- Auth / Stripe: phase 2

## Folder plan (when app exists)

```
app/          # routes, UI
engine/       # costing (existing)
docs/         # domain slices
```

## Agent slice rules

- Edit this file for structural decisions not yet in code.
- Scaffold under `app/` / `src/` here — do not move `engine/` formulas into UI components.
