# Domain: design / UI

> Auto-selected when the prompt mentions UI, screens, layout, Figma, styles, etc.

## v1 UI principles (GramWise)

- Professional artisan tool — not generic AI aesthetic
- Clear hierarchy: fixed charges → recipe → results breakdown
- Trust: show calculation lines (materials, labor, fixed load, margin)
- EN copy first; FR later
- Pastry preset labels and example recipes

## Screens (planned)

| Screen | Purpose |
|--------|---------|
| Onboarding / fixed charges | Monthly overhead categories + capacity mode |
| Recipe builder | Ingredients + labor phases + waste % |
| Results | Full cost, break-even, recommended + breakdown |
| Settings | Margin %, priced unit, yield count |

## Design tokens (TBD when stack chosen)

<!-- TODO: colors, typography, spacing once Next.js + Tailwind in repo -->

## References

- Legacy look & feel (not math): [`legacy/index.html`](../../legacy/index.html)
- Product IN/OUT: [`PRODUCT_SPEC.md`](../../PRODUCT_SPEC.md) — load only if scope question

## Agent slice rules

- Edit **this file** for UX copy, layout notes, component list.
- Edit **`src/` / `app/`** when UI code exists — not `engine/` unless displaying numbers.
- Do not load `PROJECT_BRIEF.md` or other domain docs unless user asks a cross-cutting question.
