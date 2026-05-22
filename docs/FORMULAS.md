# GramWise — Formula spec (v1)

Authoritative formulas for the costing engine. Regression targets: `docs/TEST_CASES.md`.

---

## Core outputs

| Field | Definition |
|-------|------------|
| `direct_materials` | Ingredient subtotal × (1 + waste), currency-rounded |
| `direct_labor` | Σ (hours × rate), currency-rounded |
| `fixed_load_allocated` | Monthly fixed charges allocated to this recipe run |
| `full_cost` | Sum of the three above, currency-rounded |
| `break_even_price` | Equals `full_cost` |
| `recommended_price` | Selling price at target **margin on price** (see below) |

---

## Direct materials

```
ingredient_subtotal = Σ (quantity_i × cost_per_unit_i)
direct_materials    = round_currency(ingredient_subtotal × (1 + waste_fraction))
```

- `waste_fraction`: decimal (e.g. `0.03` = 3%). UI may show percent; engine stores fraction.
- **Units:** each line is independent. Qty and cost/unit must share the same unit (kg+€/kg, each+€/each, L+€/L). No automatic unit conversion in v1.
- Line costs are not rounded before the sum; only `direct_materials` is rounded for display/assertions.

---

## Direct labor

```
direct_labor = round_currency(Σ (hours_phase_j × hourly_rate_j))
```

Recipe total hours (for hourly fixed allocation) = sum of phase hours, not rounded per phase.

---

## Fixed load allocation

Two capacity modes (mutually exclusive):

| Mode | `fixed_load_allocated` |
|------|-------------------------|
| `batches_per_month` | `round_currency(monthly_fixed / batches_per_month)` |
| `hours_per_month` | `round_currency((monthly_fixed / hours_per_month) × recipe_total_hours)` |

- **Batch mode:** one recipe run = one batch. Capacity is expected batches per month, not pieces.
- **Hourly mode:** fixed share scales with **recipe total hours**, not batch count.
- `monthly_fixed` = sum of fixed charge categories (rent, energy, etc.).

---

## Full cost and break-even

```
full_cost        = round_currency(direct_materials + direct_labor + fixed_load_allocated)
break_even_price = full_cost
```

---

## Recommended price — margin on selling price (default)

```
recommended_price = round_currency(full_cost / (1 − margin_fraction))
```

- `margin_fraction`: decimal on **selling price** (40% margin → `0.40`, divisor `0.60`).
- At **0% margin:** divisor is `1`; `recommended_price` equals `break_even_price` (Case 10).

### Margin vs markup (critical)

| Concept | Formula | Example (full cost €615.94, 20% target) |
|---------|---------|----------------------------------------|
| **Margin on price** (v1 default) | `price = cost / (1 − m)` | €615.94 / 0.80 = **€769.93** ✓ |
| **Markup on cost** (wrong default) | `price = cost × (1 + m)` | €615.94 × 1.20 = **€739.13** ✗ |

Same nominal “20%” gives different euros. Case 07 in `TEST_CASES.md` locks the margin formula. A future UI toggle for markup-on-cost must use a **separate** code path and tests.

**Sanity check:** implied margin on price = `(price − cost) / price`, not `(price − cost) / cost`.

---

## Per-piece / per-slice (yield split)

When `priced_unit` is smaller than the batch (éclair, slice):

```
batch_break_even      = full_cost   // batch-level
batch_recommended     = recommended_price
unit_break_even       = round_currency(batch_break_even / yield_count)
unit_recommended      = round_currency(batch_recommended / yield_count)
```

Apply yield **after** batch totals are computed (Cases 06, 08).

---

## Rounding

- **Currency:** 2 decimal places, **half-up** (e.g. €2.005 → €2.01).
- Intermediate sums may use IEEE doubles; asserted fields in tests are rounded outputs.
- Regression tolerance: **±€0.01** vs reference cases.

---

## Edge cases

| Case | Behavior |
|------|----------|
| `monthly_fixed = 0` | `fixed_load_allocated = 0`; engine must not divide by zero on fixed total (Case 05). |
| `margin_fraction = 0` | `recommended_price = full_cost` (Case 10). |
| `margin_fraction ≥ 1` | Invalid input; reject or clamp in UI — division by zero. |
| `batches_per_month = 0` or `hours_per_month = 0` | Invalid capacity; reject before allocation. |
| `yield_count = 0` | Invalid for per-unit pricing; reject. |
| `waste_fraction = 0` | Materials = subtotal exactly (Case 05). |
| Very low capacity (e.g. 1 batch/month) | Large fixed share per batch (Case 10). |
| Hourly capacity | Uses `recipe_total_hours`, not batch count (Case 03). |

---

## Input contract (engine)

```typescript
// waste_fraction, margin_fraction: 0..1 decimals
// margin_percent in fixtures: divide by 100 before calling engine
```

See `engine/` types and `engine/fixtures/cases.ts` for the ten reference payloads.

---

*GramWise v1 · pastry vertical · aligns with `PROJECT_BRIEF.md` §15*
