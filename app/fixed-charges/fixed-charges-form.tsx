"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_FIXED_CHARGES,
  previewFixedLoad,
  type FixedChargesForm,
} from "@/lib/fixed-charges";
import { formatMoney } from "@/lib/format";
import { useMessages } from "@/lib/i18n/locale-provider";
import { loadWizardSession, saveFixedCharges } from "@/lib/session";

export function FixedChargesForm() {
  const m = useMessages();
  const router = useRouter();
  const [form, setForm] = useState<FixedChargesForm>(DEFAULT_FIXED_CHARGES);

  useEffect(() => {
    const saved = loadWizardSession()?.fixedCharges;
    if (saved) setForm(saved);
  }, []);

  const preview = useMemo(() => previewFixedLoad(form), [form]);

  function update<K extends keyof FixedChargesForm>(
    key: K,
    value: FixedChargesForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const capacityHint =
    form.capacityMode === "batches_per_month"
      ? m.fixed.hintBatches
      : m.fixed.hintHours;

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="field-group">
          <legend className="field-group-legend">{m.fixed.monthlyLegend}</legend>
          <label className="field">
            <span className="field-label">{m.fixed.monthlyLabel}</span>
            <div className="field-input-wrap">
              <span className="field-prefix" aria-hidden>
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={form.monthlyFixedCharges}
                onChange={(e) =>
                  update("monthlyFixedCharges", e.target.value)
                }
              />
            </div>
            <span className="field-hint">{m.fixed.monthlyHint}</span>
          </label>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group-legend">{m.fixed.capacityLegend}</legend>
          <p className="field-hint field-hint-block">{m.fixed.capacityHint}</p>

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
                onChange={() =>
                  update("capacityMode", "batches_per_month")
                }
              />
              <span>{m.fixed.batchesPerMonth}</span>
            </label>
            <label className="mode-option">
              <input
                type="radio"
                name="capacityMode"
                checked={form.capacityMode === "hours_per_month"}
                onChange={() => update("capacityMode", "hours_per_month")}
              />
              <span>{m.fixed.hoursPerMonth}</span>
            </label>
          </div>

          {form.capacityMode === "batches_per_month" ? (
            <label className="field">
              <span className="field-label">{m.fixed.batchesLabel}</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={form.batchesPerMonth}
                onChange={(e) => update("batchesPerMonth", e.target.value)}
              />
              <span className="field-hint">{m.fixed.batchesHint}</span>
            </label>
          ) : (
            <div className="field-row">
              <label className="field">
                <span className="field-label">{m.fixed.shopHours}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={form.hoursPerMonth}
                  onChange={(e) => update("hoursPerMonth", e.target.value)}
                />
              </label>
              <label className="field">
                <span className="field-label">{m.fixed.recipeHours}</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.25"
                  value={form.recipeTotalHours}
                  onChange={(e) =>
                    update("recipeTotalHours", e.target.value)
                  }
                />
                <span className="field-hint">{m.fixed.recipeHoursHint}</span>
              </label>
            </div>
          )}
        </fieldset>
      </form>

      <section className="card preview-card" aria-live="polite">
        <h2>{m.fixed.previewTitle}</h2>
        {preview ? (
          <>
            <p className="preview-value">{formatMoney(preview.fixedLoadAllocated)}</p>
            <p className="preview-caption">
              {m.fixed.previewAllocated} {capacityHint}
            </p>
          </>
        ) : (
          <p className="preview-caption preview-error">{m.fixed.previewError}</p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/start" className="btn btn-ghost">
          {m.fixed.back}
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!preview}
          onClick={() => {
            saveFixedCharges(form);
            router.push("/recipe");
          }}
        >
          {m.fixed.continue}
        </button>
      </nav>
    </>
  );
}
