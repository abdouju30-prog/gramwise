# GramWise

**True cost pricing — fixed overhead included.**

Web app for artisans to price products with direct materials, labor, and **allocated fixed charges**.

- **Context for AI sessions:** [`docs/DOMAINS.md`](./docs/DOMAINS.md) → **one** domain file (see [`.cursor/rules/domain-docs-slice.mdc`](./.cursor/rules/domain-docs-slice.mdc)). [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md) is index-only.
- **Spec:** [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md)
- **Tasks:** [`TODO.md`](./TODO.md)
- **Session end (`fin`):** compress only — [`.cursor/rules/`](./.cursor/rules/) + [`docs/HANDOFF_TEMPLATE.md`](./docs/HANDOFF_TEMPLATE.md) (3-row handoff, no chat archive).
- **Legacy UI:** [`legacy/index.html`](./legacy/index.html) — earlier PâtisCoût prototype (superseded by engine-first GramWise).
- **Costing engine:** [`engine/`](./engine/) — run `npm test` for the 10 reference cases in [`docs/TEST_CASES.md`](./docs/TEST_CASES.md).

First vertical: **pastry / custom cakes**. Engine designed for more presets later.

**GitHub:** https://github.com/abdouju30-prog/gramwise
