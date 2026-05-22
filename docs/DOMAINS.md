# Documentation domains — manifest

**You do not need to `@` a file.** Hooks read `docs/intent-map.json` and pick the slice from your message.

**Agents:** if no hook context, read this table → **one** row → work → stop (do not open other domains).

| ID | File | Triggers (examples) |
|----|------|---------------------|
| `design` | [domains/design.md](domains/design.md) | UI, page, layout, Figma, button, couleur, écran |
| `architecture` | [domains/architecture.md](domains/architecture.md) | stack, Next.js, deploy, folders |
| `formulas` | [FORMULAS.md](FORMULAS.md) | margin, marge, waste, rounding, prix |
| `engine` | [../engine/](../engine/) | calculate, vitest, moteur, costing code |
| `tests` | [TEST_CASES.md](TEST_CASES.md) | case 01–10, Excel, regression |
| `product` | [../PRODUCT_SPEC.md](../PRODUCT_SPEC.md) | spec, MVP, features |
| `scope` | [domains/scope.md](domains/scope.md) | v1 IN/OUT, périmètre |
| `tasks` | [../TODO.md](../TODO.md) | P0, todo, backlog |
| `context` | [domains/context.md](domains/context.md) | problem, why, identity |
| `workflow` | [domains/workflow.md](domains/workflow.md) | hooks, handoff, session |
| `diagrams` | [domains/diagrams.md](domains/diagrams.md) | mermaid, diagram |
| `business` | [domains/business.md](domains/business.md) | Stripe, Meta, pricing model |

**Machine map:** [`intent-map.json`](intent-map.json) — edit keywords when adding domains.

**Index only:** [../PROJECT_BRIEF.md](../PROJECT_BRIEF.md) · **Handoff:** `NEXT_SESSION_HANDOFF.md` only on `fin`.

**New project:** `.cursor/templates/domain-docs/`
