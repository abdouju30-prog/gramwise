"use client";

import { useMemo } from "react";
import type { CapacityMode } from "@/lib/fixed-charges";
import { formatFromMad } from "@/lib/currency";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import { parsePositive } from "@/lib/parse";
import {
  parseLaborPhases,
  recipeLaborHours,
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
  const { entryCurrency } = useLocale();

  const previewFormula = useMemo(() => {
    if (monthlyTotal === null || fixedLoadAllocated === null) return null;

    if (form.capacityMode === "batches_per_month") {
      const batches = parsePositive(form.batchesPerMonth);
      if (batches === null) return null;
      return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${batches} = ${formatFromMad(fixedLoadAllocated, entryCurrency)} ${m.fixed.previewPerBatch}`;
    }

    const shopHours = parsePositive(form.hoursPerMonth);
    const phases = parseLaborPhases(form.laborPhases);
    const recipeHours = phases ? recipeLaborHours(phases) : null;
    if (shopHours === null || recipeHours === null || recipeHours === 0) return null;
    return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${shopHours} h × ${recipeHours} h = ${formatFromMad(fixedLoadAllocated, entryCurrency)} ${m.fixed.previewPerRecipe}`;
  }, [
    form,
    monthlyTotal,
    fixedLoadAllocated,
    entryCurrency,
    m.fixed.previewPerBatch,
    m.fixed.previewPerRecipe,
  ]);

  function setCapacityMode(mode: CapacityMode) {
    onUpdate("capacityMode", mode);
  }

  return (
    <div className="recipe-composer-section">
      <p className="recipe-section-label">{m.fixed.capacityLegend}</p>
      <p className="explain-short capacity-explain">{m.fixed.capacityExplainShort}</p>
      <p className="field-hint field-hint-block">{m.fixed.capacityChooseMode}</p>

      <div
        className="mode-toggle"
        role="radiogroup"
        aria-label={m.fixed.capacityMode}
      >
        <label className="mode-option">
          <input
            type="radio"
            name="capacityMode"
            checked={form.capacityMode === "batches_per_month"}
            onChange={() => setCapacityMode("batches_per_month")}
          />
          <span className="mode-option-text">
            <span className="mode-option-title">{m.fixed.batchesPerMonth}</span>
            <span className="mode-option-desc">{m.fixed.batchesPerMonthDesc}</span>
          </span>
        </label>
        <label className="mode-option">
          <input
            type="radio"
            name="capacityMode"
            checked={form.capacityMode === "hours_per_month"}
            onChange={() => setCapacityMode("hours_per_month")}
          />
          <span className="mode-option-text">
            <span className="mode-option-title">{m.fixed.hoursPerMonth}</span>
            <span className="mode-option-desc">{m.fixed.hoursPerMonthDesc}</span>
          </span>
        </label>
      </div>

      {form.capacityMode === "batches_per_month" ? (
        <>
          <p className="field-hint field-hint-block">{m.fixed.capacityBatchesExplain}</p>
          <label className="field">
            <span className="field-label">{m.fixed.batchesLabel}</span>
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={form.batchesPerMonth}
              onChange={(e) => onUpdate("batchesPerMonth", e.target.value)}
            />
            <span className="field-hint">{m.fixed.batchesHint}</span>
          </label>
        </>
      ) : (
        <>
          <p className="field-hint field-hint-block">{m.fixed.capacityHoursExplain}</p>
          <label className="field">
            <span className="field-label">{m.fixed.shopHours}</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={form.hoursPerMonth}
              onChange={(e) => onUpdate("hoursPerMonth", e.target.value)}
            />
            <span className="field-hint">{m.fixed.recipeHoursHint}</span>
          </label>
        </>
      )}

      {previewFormula ? (
        <div className="capacity-example" aria-live="polite">
          <span className="capacity-example-label">{m.fixed.capacityExampleLabel}</span>
          <p className="capacity-example-formula">{previewFormula}</p>
        </div>
      ) : null}
    </div>
  );
}
