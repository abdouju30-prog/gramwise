# FixLoad — Pastry reference test cases (v1)

Ten scenarios for the **pastry vertical**. Each case must match these formulas (see `PROJECT_BRIEF.md` §15):

```
fixed_load_per_batch  = monthly_fixed_charges / batches_per_month
fixed_load_hourly     = (monthly_fixed_charges / hours_per_month) × recipe_total_hours

direct_materials      = sum(qty_i × cost_per_unit_i) × (1 + waste_percent)
direct_labor          = sum(hours_j × hourly_rate_j)
full_cost             = direct_materials + direct_labor + fixed_load_allocated
break_even_price      = full_cost
recommended_price     = full_cost / (1 − margin_percent)   // margin on selling price
```

**Capacity modes**

| Mode | `fixed_load_allocated` |
|------|-------------------------|
| `batches_per_month` | `monthly_fixed / batches_per_month` (one recipe run = one batch) |
| `hours_per_month` | `(monthly_fixed / hours_per_month) × recipe_total_hours` |

**Rounding:** currency to **2 decimals** (half-up). Intermediate values may use full precision; asserted outputs are rounded.

**Priced unit:** stated per case (batch, piece, or slice).

---

## Case 01 — Cupcakes (batch capacity, standard margin)

**Story:** Home-style pastry lab, 40 cupcake batches/month.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €1 100 (rent 800 + energy 150 + insurance 80 + subscriptions 50 + other 20) |
| Capacity | `batches_per_month` = 40 |
| Waste | 3% |
| Margin | 40% |
| **Priced unit** | **1 batch** (24 cupcakes) |

**Ingredients (1 batch)**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Flour | 0.8 | kg | €0.45 | €0.36 |
| Sugar | 0.6 | kg | €0.65 | €0.39 |
| Butter | 0.5 | kg | €6.20 | €3.10 |
| Eggs | 6 | each | €0.28 | €1.68 |
| Milk | 0.4 | L | €0.90 | €0.36 |
| Baking powder | 0.05 | kg | €3.00 | €0.15 |
| **Subtotal** | | | | **€6.04** |

**Labor (1 batch)**

| Phase | Hours | €/h | Cost |
|-------|-------|-----|------|
| Prep | 1.0 | 18 | €18.00 |
| Bake | 0.75 | 18 | €13.50 |
| Finish | 0.5 | 15 | €7.50 |
| **Total** | **2.25** | | **€39.00** |

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €6.04 × 1.03 = **€6.22** |
| `direct_labor` | **€39.00** |
| `fixed_load_allocated` | €1 100 / 40 = **€27.50** |
| `full_cost` | **€72.72** |
| `break_even_price` | **€72.72** |
| `recommended_price` | €72.7212 / 0.60 = **€121.20** |

*Optional per cupcake (÷24): break-even **€3.03**, recommended **€5.05**.*

---

## Case 02 — Wedding cake (high labor, batch capacity)

**Story:** Custom wedding cakes, low monthly volume.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €1 200 |
| Capacity | `batches_per_month` = 8 |
| Waste | 10% |
| Margin | 35% |
| **Priced unit** | **1 cake** (1 batch) |

**Ingredients**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Butter | 3.0 | kg | €6.20 | €18.60 |
| Flour | 1.5 | kg | €0.45 | €0.68 |
| Sugar | 2.5 | kg | €0.65 | €1.63 |
| Eggs | 36 | each | €0.28 | €10.08 |
| Dark chocolate | 2.0 | kg | €12.00 | €24.00 |
| Cream | 4.0 | L | €5.00 | €20.00 |
| Fondant | 3.0 | kg | €7.50 | €22.50 |
| Almond paste | 0.5 | kg | €14.00 | €7.00 |
| **Subtotal** | | | | **€104.49** |

**Labor**

| Phase | Hours | €/h | Cost |
|-------|-------|-----|------|
| Consult / design | 3 | 25 | €75.00 |
| Bake layers | 5 | 20 | €100.00 |
| Assembly & decor | 8 | 22 | €176.00 |
| **Total** | **16** | | **€351.00** |

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €104.49 × 1.10 = **€114.94** |
| `direct_labor` | **€351.00** |
| `fixed_load_allocated` | €1 200 / 8 = **€150.00** |
| `full_cost` | **€615.94** |
| `break_even_price` | **€615.94** |
| `recommended_price` | €615.94 / 0.65 = **€947.60** |

---

## Case 03 — Macarons (hourly capacity allocation)

**Story:** Shop tracks capacity in **hours/month**, not batches.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €900 |
| Capacity | `hours_per_month` = 120 |
| Recipe total hours | 4.0 (all phases) |
| Waste | 12% |
| Margin | 50% |
| **Priced unit** | **1 batch** (~80 shells) |

**Ingredients**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Almond flour | 0.5 | kg | €12.00 | €6.00 |
| Icing sugar | 0.8 | kg | €1.10 | €0.88 |
| Granulated sugar | 0.35 | kg | €0.65 | €0.23 |
| Egg whites | 0.25 | L | €4.00 | €1.00 |
| Gel food colour | 0.005 | kg | €20.00 | €0.10 |
| Butter (filling) | 0.4 | kg | €6.20 | €2.48 |
| **Subtotal** | | | | **€10.69** |

**Labor**

| Phase | Hours | €/h | Cost |
|-------|-------|-----|------|
| Meringue & pipe | 2.5 | 20 | €50.00 |
| Rest & bake | 1.5 | 20 | €30.00 |
| Fill & pair | 4.0 | 20 | €80.00 total |

*(Single rate: 4 h × €20 = €80.00.)*

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €10.69 × 1.12 = **€11.97** |
| `direct_labor` | **€80.00** |
| `fixed_load_allocated` | (€900 / 120) × 4 = **€30.00** |
| `full_cost` | **€121.97** |
| `break_even_price` | **€121.97** |
| `recommended_price` | €121.97 / 0.50 = **€243.94** |

---

## Case 04 — Individual apple tart (high batch volume)

**Story:** High-throughput boutique; one tart = one batch.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €680 |
| Capacity | `batches_per_month` = 200 |
| Waste | 5% |
| Margin | 45% |
| **Priced unit** | **1 tart** |

**Ingredients**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Flour | 0.15 | kg | €0.45 | €0.07 |
| Butter | 0.12 | kg | €6.20 | €0.74 |
| Sugar | 0.08 | kg | €0.65 | €0.05 |
| Egg | 1 | each | €0.28 | €0.28 |
| Apples | 0.6 | kg | €2.50 | €1.50 |
| Cream | 0.1 | L | €3.00 | €0.30 |
| **Subtotal** | | | | **€2.94** |

**Labor**

| Phase | Hours | €/h | Cost |
|-------|-------|-----|------|
| Prep & line | 0.4 | 18 | €7.20 |
| Bake | 0.35 | 18 | €6.30 |
| **Total** | **0.75** | | **€13.50** |

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €2.94 × 1.05 = **€3.09** |
| `direct_labor` | **€13.50** |
| `fixed_load_allocated` | €680 / 200 = **€3.40** |
| `full_cost` | **€19.99** |
| `break_even_price` | **€19.99** |
| `recommended_price` | €19.99 / 0.55 = **€36.35** |

---

## Case 05 — Yule logs, zero fixed charges (home baker)

**Story:** No monthly overhead entered (engine must not crash).

| Input | Value |
|-------|-------|
| Monthly fixed charges | €0 |
| Capacity | `batches_per_month` = 30 |
| Waste | 0% |
| Margin | 25% |
| **Priced unit** | **1 batch** (20 logs) |

**Ingredients**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Flour | 1.0 | kg | €0.45 | €0.45 |
| Butter | 0.8 | kg | €6.20 | €4.96 |
| Sugar | 0.5 | kg | €0.65 | €0.33 |
| Eggs | 4 | each | €0.28 | €1.12 |
| Chocolate | 0.5 | kg | €10.00 | €5.00 |
| **Subtotal** | | | | **€11.86** |

**Labor:** 2.0 h × €16/h = **€32.00**

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | **€11.86** |
| `direct_labor` | **€32.00** |
| `fixed_load_allocated` | €0 / 30 = **€0.00** |
| `full_cost` | **€43.86** |
| `break_even_price` | **€43.86** |
| `recommended_price` | €43.86 / 0.75 = **€58.48** |

---

## Case 06 — Éclairs (per-piece price from batch yield)

**Story:** Same batch math; display price **per éclair**.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €950 |
| Capacity | `batches_per_month` = 50 |
| Waste | 4% |
| Margin | 55% |
| Batch yield | **12 éclairs** |
| **Priced unit** | **1 éclair** |

**Ingredients (batch)**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Flour | 0.25 | kg | €0.45 | €0.11 |
| Butter | 0.35 | kg | €6.20 | €2.17 |
| Milk | 0.6 | L | €0.90 | €0.54 |
| Eggs | 4 | each | €0.28 | €1.12 |
| Pastry cream | 0.3 | L | €4.50 | €1.35 |
| Dark chocolate (glaze) | 0.2 | kg | €11.00 | €2.20 |
| **Subtotal** | | | | **€7.49** |

**Labor (batch):** 0.6+0.5+0.8 h at €18 / €18 / €17 → **€34.20**

**Expected outputs (batch)**

| Field | Value |
|-------|-------|
| `direct_materials` | €7.49 × 1.04 = **€7.79** |
| `direct_labor` | **€34.20** |
| `fixed_load_allocated` | €950 / 50 = **€19.00** |
| `full_cost` | **€60.99** |
| `break_even_price` (batch) | **€60.99** |
| `recommended_price` (batch) | €60.99 / 0.45 = **€135.53** |

**Per éclair (÷12)**

| Field | Value |
|-------|-------|
| `break_even_price` | **€5.08** |
| `recommended_price` | **€11.29** |

---

## Case 07 — Wedding cake, low margin (margin ≠ markup check)

**Story:** Same inputs as **Case 02**; only margin changes. Guards against markup-on-cost bug (`full_cost × 1.20` would give €739.13 — **wrong**).

| Input | Value |
|-------|-------|
| *(Same as Case 02)* | |
| Margin | **20%** (on selling price) |
| **Priced unit** | **1 cake** |

**Expected outputs**

| Field | Value |
|-------|-------|
| `full_cost` | **€615.94** *(unchanged)* |
| `break_even_price` | **€615.94** |
| `recommended_price` | €615.94 / 0.80 = **€769.93** |
| `wrong_if_markup_on_cost` | €615.94 × 1.20 = €739.13 — **must NOT be used** |

---

## Case 08 — Cake slice (yield split + multi-phase labor)

**Story:** Entremets sold by the slice; batch makes 12 portions.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €520 |
| Capacity | `batches_per_month` = 100 |
| Waste | 6% |
| Margin | 30% |
| Batch yield | **12 slices** |
| **Priced unit** | **1 slice** |

**Ingredients (batch)** — subtotal **€8.50**

**Labor (batch)**

| Phase | Hours | €/h | Cost |
|-------|-------|-----|------|
| Prep & bake | 2 | 17 | €34.00 |
| Bake (oven) | 1 | 18 | €18.00 |
| Portion & display | 0.5 | 15 | €7.50 |
| **Total** | **3.5** | | **€59.50** |

**Expected outputs (batch)**

| Field | Value |
|-------|-------|
| `direct_materials` | €8.50 × 1.06 = **€9.01** |
| `direct_labor` | **€59.50** |
| `fixed_load_allocated` | €520 / 100 = **€5.20** |
| `full_cost` | **€73.71** |
| `break_even_price` (batch) | **€73.71** |
| `recommended_price` (batch) | €73.71 / 0.70 = **€105.30** |

**Per slice (÷12)**

| Field | Value |
|-------|-------|
| `break_even_price` | **€6.14** |
| `recommended_price` | **€8.78** |

---

## Case 09 — Large cookie batch (mixed units, higher overhead)

**Story:** Wholesale-style cookies; validates kg + each + mL on one recipe.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €2 000 |
| Capacity | `batches_per_month` = 80 |
| Waste | 2% |
| Margin | 38% |
| **Priced unit** | **1 batch** (96 cookies) |

**Ingredients**

| Line | Qty | Unit | Cost/unit | Line cost |
|------|-----|------|-----------|-----------|
| Flour | 2.0 | kg | €0.45 | €0.90 |
| Butter | 1.5 | kg | €6.20 | €9.30 |
| Chocolate chips | 0.8 | kg | €7.00 | €5.60 |
| Sugar | 1.0 | kg | €0.65 | €0.65 |
| Eggs | 3 | each | €0.28 | €0.84 |
| Vanilla extract | 0.01 | L | €80.00 | €0.80 |
| **Subtotal** | | | | **€18.09** |

**Labor:** 1.5 h × €19/h = **€28.50**

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €18.09 × 1.02 = **€18.45** |
| `direct_labor` | **€28.50** |
| `fixed_load_allocated` | €2 000 / 80 = **€25.00** |
| `full_cost` | **€71.95** |
| `break_even_price` | **€71.95** |
| `recommended_price` | €71.95 / 0.62 = **€116.05** |

---

## Case 10 — Break-even only (0% margin) + extreme fixed load

**Story:** Margin slider at 0%; very low capacity inflates fixed share per batch.

| Input | Value |
|-------|-------|
| Monthly fixed charges | €2 400 |
| Capacity | `batches_per_month` = **1** |
| Waste | 5% |
| Margin | **0%** |
| **Priced unit** | **1 celebration cake** (1 batch) |

**Ingredients** — subtotal **€42.00**

**Labor:** 20 h × €22/h = **€440.00**

**Expected outputs**

| Field | Value |
|-------|-------|
| `direct_materials` | €42.00 × 1.05 = **€44.10** |
| `direct_labor` | **€440.00** |
| `fixed_load_allocated` | €2 400 / 1 = **€2 400.00** |
| `full_cost` | **€2 884.10** |
| `break_even_price` | **€2 884.10** |
| `recommended_price` | €2 884.10 / 1.00 = **€2 884.10** *(equals break-even)* |

---

## Summary matrix (engine regression)

| Case | Capacity mode | Full cost | Recommended | Notes |
|------|---------------|-----------|-------------|-------|
| 01 | batches | €72.72 | €121.20 | Baseline |
| 02 | batches | €615.94 | €947.60 | High labor |
| 03 | hours × recipe h | €121.97 | €243.94 | Hourly allocation |
| 04 | batches | €19.99 | €36.35 | High volume / low fixed share |
| 05 | batches | €43.86 | €58.48 | Zero fixed |
| 06 | batches | €60.99 batch / €5.08 pc | €135.53 / €11.29 pc | Yield split |
| 07 | batches | €615.94 | €769.93 | Anti-markup regression |
| 08 | batches | €73.71 batch / €6.14 slice | €105.30 / €8.78 slice | Yield split |
| 09 | batches | €71.95 | €116.05 | Mixed units |
| 10 | batches | €2 884.10 | €2 884.10 | 0% margin; max fixed load |

---

## Excel validation checklist

- [ ] One sheet tab per case (01–10)
- [ ] Cells mirror: fixed total, capacity, ingredients table, labor table, waste %, margin %
- [ ] Named cells for `full_cost`, `break_even_price`, `recommended_price`
- [ ] Case 07: confirm recommended ≠ `full_cost × (1 + margin)`
- [ ] Case 03: fixed allocation uses **recipe hours**, not batch count
- [ ] Cases 06 & 08: per-unit = batch totals ÷ yield

When all ten match within **€0.01**, mark `TODO.md` P0 item done and implement `engine/` tests against this file.

---

*FixLoad v1 · pastry vertical · 2026-05-22*
