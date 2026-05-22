# GramWise

**True cost pricing — fixed overhead included.**

Web app for artisans to price products with direct materials, labor, and **allocated fixed charges**.

- **Context for AI sessions:** write normally — hooks auto-pick the doc slice ([`docs/intent-map.json`](./docs/intent-map.json)). Manual map: [`docs/DOMAINS.md`](./docs/DOMAINS.md). No need to `@` every file.
- **Spec:** [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md)
- **Tasks:** [`TODO.md`](./TODO.md)
- **Session end (`fin`):** compress only — [`.cursor/rules/`](./.cursor/rules/) + [`docs/HANDOFF_TEMPLATE.md`](./docs/HANDOFF_TEMPLATE.md) (3-row handoff, no chat archive).
- **One-word commands:** `bonjour` · `go` · `fin` · `compresse` · `explique` · `scope` — [`.cursor/HOOKS.md`](./.cursor/HOOKS.md).
- **Legacy UI:** [`legacy/index.html`](./legacy/index.html) — earlier PâtisCoût prototype (superseded by engine-first GramWise).
- **Costing engine:** [`engine/`](./engine/) — run `npm test` for the 10 reference cases in [`docs/TEST_CASES.md`](./docs/TEST_CASES.md).
- **Deploy (Vercel):** [`docs/DEPLOY_VERCEL.md`](./docs/DEPLOY_VERCEL.md) — set `NEXT_PUBLIC_APP_URL` on production.
- **Beta (5 pâtissiers):** [`docs/BETA_CHECKLIST.md`](./docs/BETA_CHECKLIST.md) — Stripe test only until legal entity.

First vertical: **pastry / custom cakes**. Engine designed for more presets later.

**GitHub:** https://github.com/abdouju30-prog/gramwise
