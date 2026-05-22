# FixLoad — Product Spec v1

## IN

- Monthly fixed charge categories (rent, energy, insurance, subscriptions, other)
- Capacity: `hours_per_month` OR `batches_per_month`
- Recipe builder: ingredients (qty, unit, cost/unit), labor phases (hours, rate)
- Waste / loss percentage on materials
- Margin on selling price (not markup on cost unless explicitly toggled — default: margin)
- Result: full cost, break-even, recommended price, line-by-line breakdown
- Pastry vertical preset (copy, default categories, 1–2 example recipes)
- English UI for v1

## OUT

- Multi-tenant teams
- Quotes, invoices, PDF export (v2)
- Patisprix-level ERP (nutrition, inventory, unlimited recipes)
- LLM-generated prices
- Mobile native apps
- Non-pastry presets in v1 launch

## Accuracy requirements

- Engine covered by automated tests
- 10 manual reference cases in `docs/TEST_CASES.md` — all must pass before public launch
