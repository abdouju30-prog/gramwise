"use client";

import { useMemo } from "react";
import type { CapacityMode } from "@/lib/fixed-charges";
import { formatFromMad } from "@/lib/currency";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import { parsePositive } from "@/lib/parse";
import {
  parseLaborPhases,
  recipeLaborHours,
  type ProductionCountUnit,
  type RecipeForm,
} from "@/lib/recipe";

type Props = {
  form: RecipeForm;
  monthlyTotal: number | null;
  fixedLoadAllocated: number | null;
  onUpdate: <K extends keyof RecipeForm>(key: K, value: RecipeForm[K]) => void;
};

export function RecipeCapacitySection({
  form,
  monthlyTotal,
  fixedLoadAllocated,
  onUpdate,
}: Props) {
  const m = useMessages();
  const c = m.recipe.capacity;
  const { entryCurrency } = useLocale();

  const perUnitLabel =
    form.productionCountUnit === "preparations"
      ? c.perPreparation
      : c.perBatch;

  const countLabel =
    form.productionCountUnit === "preparations"
      ? c.countLabelPreparations
      : c.countLabelBatches;

  const previewFormula = useMemo(() => {
    if (monthlyTotal === null || fixedLoadAllocated === null) return null;

    if (form.capacityMode === "batches_per_month") {
      const count = parsePositive(form.batchesPerMonth);
      if (count === null) return null;
      return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${count} = ${formatFromMad(fixedLoadAllocated, entryCurrency)} ${perUnitLabel}`;
    }

    const shopHours = parsePositive(form.hoursPerMonth);
    const phases = parseLaborPhases(form.laborPhases, entryCurrency);
    const recipeHours = phases ? recipeLaborHours(phases) : null;
    if (shopHours === null || recipeHours === null || recipeHours === 0) return null;
    return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${shopHours} h × ${recipeHours} h = ${formatFromMad(fixedLoadAllocated, entryCurrency)}`;
  }, [
    form,
    monthlyTotal,
    fixedLoadAllocated,
    entryCurrency,
    perUnitLabel,
  ]);

  function setCountUnit(unit: ProductionCountUnit) {
    onUpdate("productionCountUnit", unit);
    onUpdate("capacityMode", "batches_per_month");
  }

  function setCapacityMode(mode: CapacityMode) {
    onUpdate("capacityMode", mode);
  }

  return (
    <div className="recipe-composer-section">
      <p className="recipe-section-label">{c.title}</p>
      <p className="field-hint field-hint-block">{c.hint}</p>

      <div
        className="mode-toggle mode-toggle--compact"
        role="radiogroup"
        aria-label={c.modeGroup}
      >
        <label className="mode-option">
          <input
            type="radio"
            name="productionCountUnit"
            checked={
              form.capacityMode === "batches_per_month" &&
              form.productionCountUnit === "batches"
            }
            onChange={() => setCountUnit("batches")}
          />
          <span className="mode-option-title">{c.unitBatches}</span>
        </label>
        <label className="mode-option">
          <input
            type="radio"
            name="productionCountUnit"
            checked={
              form.capacityMode === "batches_per_month" &&
              form.productionCountUnit === "preparations"
            }
            onChange={() => setCountUnit("preparations")}
          />
          <span className="mode-option-title">{c.unitPreparations}</span>
        </label>
        <label className="mode-option">
          <input
            type="radio"
            name="capacityMode"
            checked={form.capacityMode === "hours_per_month"}
            onChange={() => setCapacityMode("hours_per_month")}
          />
          <span className="mode-option-title">{c.unitHours}</span>
        </label>
      </div>

      {form.capacityMode === "batches_per_month" ? (
        <label className="field">
          <span className="field-label">{countLabel}</span>
          <div className="capacity-input-row">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={form.batchesPerMonth}
              onChange={(e) => onUpdate("batchesPerMonth", e.target.value)}
            />
            {fixedLoadAllocated !== null && monthlyTotal !== null ? (
              <span className="capacity-result" aria-live="polite">
                → {formatFromMad(fixedLoadAllocated, entryCurrency)} {perUnitLabel}
              </span>
            ) : null}
          </div>
        </label>
      ) : (
        <label className="field">
          <span className="field-label">{c.shopHours}</span>
          <input
            type="number"
            inputMode="decimal"
            min="0"
            step="0.5"
            value={form.hoursPerMonth}
            onChange={(e) => onUpdate("hoursPerMonth", e.target.value)}
          />
        </label>
      )}

      {previewFormula ? (
        <p className="capacity-example-formula" aria-live="polite">
          {previewFormula}
        </p>
      ) : null}
    </div>
  );
}
