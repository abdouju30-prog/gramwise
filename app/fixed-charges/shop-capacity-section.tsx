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

  const perBatch = useMemo(
    () => previewShopFixedPerBatch(form, entryCurrency),
    [form, entryCurrency],
  );

  const batchResult = useMemo(() => {
    if (!perBatch || monthlyTotal === null) return null;
    return formatFromMad(perBatch.fixedLoadAllocated, entryCurrency);
  }, [perBatch, monthlyTotal, entryCurrency]);

  function setCapacityMode(mode: CapacityMode) {
    onUpdate("capacityMode", mode);
  }

  return (
    <fieldset className="field-group shop-capacity">
      <legend className="field-group-legend">{m.fixed.capacityLegend}</legend>
      <p className="field-hint field-hint-block">{m.fixed.capacityHint}</p>

      <div className="mode-toggle mode-toggle--compact" role="radiogroup">
        <label className="mode-option">
          <input
            type="radio"
            name="shopCapacityMode"
            checked={form.capacityMode === "batches_per_month"}
            onChange={() => setCapacityMode("batches_per_month")}
          />
          <span className="mode-option-title">{m.fixed.batchesPerMonth}</span>
        </label>
        <label className="mode-option">
          <input
            type="radio"
            name="shopCapacityMode"
            checked={form.capacityMode === "hours_per_month"}
            onChange={() => setCapacityMode("hours_per_month")}
          />
          <span className="mode-option-title">{m.fixed.hoursPerMonth}</span>
        </label>
      </div>

      {form.capacityMode === "batches_per_month" ? (
        <label className="field">
          <span className="field-label">{m.fixed.batchesLabel}</span>
          <div className="capacity-input-row">
            <input
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={form.batchesPerMonth}
              onChange={(e) => onUpdate("batchesPerMonth", e.target.value)}
            />
            {batchResult ? (
              <span className="capacity-result" aria-live="polite">
                → {batchResult} {m.fixed.previewPerBatch}
              </span>
            ) : null}
          </div>
        </label>
      ) : (
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
        </label>
      )}
    </fieldset>
  );
}
