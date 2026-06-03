"use client";

import { useMemo } from "react";
import {
  previewShopFixedPerBatch,
  type CapacityMode,
  type FixedChargesForm,
} from "@/lib/fixed-charges";
import { formatFromMad } from "@/lib/currency";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";

type Props = {
  form: FixedChargesForm;
  monthlyTotal: number | null;
  onUpdate: <K extends keyof FixedChargesForm>(
    key: K,
    value: FixedChargesForm[K],
  ) => void;
};

export function ShopCapacitySection({ form, monthlyTotal, onUpdate }: Props) {
  const m = useMessages();
  const { entryCurrency } = useLocale();

  const perBatchPreview = useMemo(
    () => previewShopFixedPerBatch(form, entryCurrency),
    [form, entryCurrency],
  );

  const previewFormula = useMemo(() => {
    if (!perBatchPreview || monthlyTotal === null) return null;
    const batches = form.batchesPerMonth.trim();
    if (!batches) return null;
    return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${batches} = ${formatFromMad(perBatchPreview.fixedLoadAllocated, entryCurrency)} ${m.fixed.previewPerBatch}`;
  }, [form.batchesPerMonth, monthlyTotal, perBatchPreview, entryCurrency, m.fixed.previewPerBatch]);

  function setCapacityMode(mode: CapacityMode) {
    onUpdate("capacityMode", mode);
  }

  return (
    <fieldset className="field-group">
      <legend className="field-group-legend">{m.fixed.capacityLegend}</legend>
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
            name="shopCapacityMode"
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
            name="shopCapacityMode"
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
          {previewFormula ? (
            <div className="capacity-example" aria-live="polite">
              <span className="capacity-example-label">{m.fixed.capacityExampleLabel}</span>
              <p className="capacity-example-formula">{previewFormula}</p>
              <p className="field-hint field-hint-block">{m.fixed.shopBatchNote}</p>
            </div>
          ) : null}
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
            <span className="field-hint">{m.fixed.shopHoursHint}</span>
          </label>
        </>
      )}
    </fieldset>
  );
}
