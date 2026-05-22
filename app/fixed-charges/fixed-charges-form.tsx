"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createCustomChargeLine,
  DEFAULT_FIXED_CHARGES,
  monthlyFixedTotal,
  normalizeFixedChargesForm,
  previewFixedLoad,
  type ChargeLinePreset,
  type FixedChargeLine,
  type FixedChargesForm,
} from "@/lib/fixed-charges";
import { formatMoney } from "@/lib/format";
import { parsePositive } from "@/lib/parse";
import { useMessages } from "@/lib/i18n/locale-provider";
import type { Messages } from "@/lib/i18n/types";
import { loadWizardSession, saveFixedCharges } from "@/lib/session";

function presetLabel(
  preset: ChargeLinePreset,
  fixed: Messages["fixed"],
): string {
  switch (preset) {
    case "rent":
      return fixed.chargeRent;
    case "energy":
      return fixed.chargeEnergy;
    case "insurance":
      return fixed.chargeInsurance;
    case "subscriptions":
      return fixed.chargeSubscriptions;
    default:
      return "";
  }
}

export function FixedChargesForm() {
  const m = useMessages();
  const router = useRouter();
  const [form, setForm] = useState<FixedChargesForm>(DEFAULT_FIXED_CHARGES);

  useEffect(() => {
    const saved = loadWizardSession()?.fixedCharges;
    if (saved) setForm(normalizeFixedChargesForm(saved));
  }, []);

  const monthlyTotal = useMemo(
    () => monthlyFixedTotal(form.chargeLines),
    [form.chargeLines],
  );

  const preview = useMemo(() => previewFixedLoad(form), [form]);

  function update<K extends keyof FixedChargesForm>(
    key: K,
    value: FixedChargesForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateChargeLine(
    id: string,
    patch: Partial<Pick<FixedChargeLine, "amount" | "customLabel">>,
  ) {
    setForm((prev) => ({
      ...prev,
      chargeLines: prev.chargeLines.map((line) =>
        line.id === id ? { ...line, ...patch } : line,
      ),
    }));
  }

  function addChargeLine() {
    setForm((prev) => ({
      ...prev,
      chargeLines: [...prev.chargeLines, createCustomChargeLine()],
    }));
  }

  function removeChargeLine(id: string) {
    setForm((prev) => ({
      ...prev,
      chargeLines: prev.chargeLines.filter((line) => line.id !== id),
    }));
  }

  const previewFormula = useMemo(() => {
    if (!preview || monthlyTotal === null) return null;

    if (form.capacityMode === "batches_per_month") {
      const batches = parsePositive(form.batchesPerMonth);
      if (batches === null) return null;
      return `${formatMoney(monthlyTotal)} ÷ ${batches} = ${formatMoney(preview.fixedLoadAllocated)} ${m.fixed.previewPerBatch}`;
    }

    const shopHours = parsePositive(form.hoursPerMonth);
    const recipeHours = parsePositive(form.recipeTotalHours);
    if (shopHours === null || recipeHours === null) return null;
    return `${formatMoney(monthlyTotal)} ÷ ${shopHours} h × ${recipeHours} h = ${formatMoney(preview.fixedLoadAllocated)} ${m.fixed.previewPerRecipe}`;
  }, [form, preview, monthlyTotal, m.fixed.previewPerBatch, m.fixed.previewPerRecipe]);

  const totalDisplay =
    monthlyTotal === null ? "—" : formatMoney(monthlyTotal);

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="field-group">
          <legend className="field-group-legend">{m.fixed.monthlyLegend}</legend>
          <p className="field-hint field-hint-block">{m.fixed.monthlyHint}</p>

          <div className="charge-lines" role="table">
            <div className="charge-lines-head" role="row">
              <span role="columnheader">{m.fixed.chargeCategory}</span>
              <span role="columnheader">{m.fixed.chargeAmount}</span>
              <span className="charge-lines-actions-head" aria-hidden />
            </div>
            {form.chargeLines.map((line) => (
              <div key={line.id} className="charge-lines-row" role="row">
                {line.preset === "custom" ? (
                  <input
                    type="text"
                    role="cell"
                    className="charge-line-name-input"
                    value={line.customLabel ?? ""}
                    onChange={(e) =>
                      updateChargeLine(line.id, {
                        customLabel: e.target.value,
                      })
                    }
                    placeholder={m.fixed.chargeCustomPlaceholder}
                    aria-label={m.fixed.chargeCustomPlaceholder}
                  />
                ) : (
                  <span className="charge-line-label" role="cell">
                    {presetLabel(line.preset, m.fixed)}
                  </span>
                )}
                <div className="field-input-wrap charge-line-amount" role="cell">
                  <span className="field-prefix" aria-hidden>
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={line.amount}
                    onChange={(e) =>
                      updateChargeLine(line.id, { amount: e.target.value })
                    }
                    aria-label={`${line.preset === "custom" ? line.customLabel || m.fixed.chargeCustomPlaceholder : presetLabel(line.preset, m.fixed)} — ${m.fixed.chargeAmount}`}
                  />
                </div>
                {line.preset === "custom" ? (
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeChargeLine(line.id)}
                    aria-label={m.fixed.removeChargeLine}
                  >
                    ×
                  </button>
                ) : (
                  <span className="charge-lines-actions-head" aria-hidden />
                )}
              </div>
            ))}
          </div>

          <div className="charge-total" aria-live="polite">
            <span className="charge-total-label">{m.fixed.monthlyTotalLabel}</span>
            <span
              className={`charge-total-value${monthlyTotal === null ? " charge-total-invalid" : ""}`}
            >
              {totalDisplay}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={addChargeLine}
          >
            {m.fixed.addChargeLine}
          </button>
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
            <p className="preview-caption">{m.fixed.previewAllocated}</p>
            {previewFormula ? (
              <p className="preview-formula">{previewFormula}</p>
            ) : null}
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
