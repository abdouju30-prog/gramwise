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
import { loadWizardSession, saveFixedCharges } from "@/lib/session";

export function FixedChargesForm() {
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
      ? "Monthly fixed ÷ batches per month"
      : "Monthly fixed ÷ shop hours × recipe hours";

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="field-group">
          <legend className="field-group-legend">Monthly overhead</legend>
          <label className="field">
            <span className="field-label">Total fixed charges / month</span>
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
            <span className="field-hint">
              Rent, utilities, insurance, subscriptions — one monthly total.
            </span>
          </label>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group-legend">Capacity</legend>
          <p className="field-hint field-hint-block">
            How you spread fixed costs across production.
          </p>

          <div className="mode-toggle" role="radiogroup" aria-label="Capacity mode">
            <label className="mode-option">
              <input
                type="radio"
                name="capacityMode"
                checked={form.capacityMode === "batches_per_month"}
                onChange={() =>
                  update("capacityMode", "batches_per_month")
                }
              />
              <span>Batches per month</span>
            </label>
            <label className="mode-option">
              <input
                type="radio"
                name="capacityMode"
                checked={form.capacityMode === "hours_per_month"}
                onChange={() => update("capacityMode", "hours_per_month")}
              />
              <span>Hours per month</span>
            </label>
          </div>

          {form.capacityMode === "batches_per_month" ? (
            <label className="field">
              <span className="field-label">Batches per month</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={form.batchesPerMonth}
                onChange={(e) => update("batchesPerMonth", e.target.value)}
              />
              <span className="field-hint">
                How many full recipe runs you produce in a typical month.
              </span>
            </label>
          ) : (
            <div className="field-row">
              <label className="field">
                <span className="field-label">Shop hours / month</span>
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
                <span className="field-label">Recipe labor hours</span>
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
                <span className="field-hint">
                  Total hours for this recipe (all phases).
                </span>
              </label>
            </div>
          )}
        </fieldset>
      </form>

      <section className="card preview-card" aria-live="polite">
        <h2>Fixed load preview</h2>
        {preview ? (
          <>
            <p className="preview-value">{formatMoney(preview.fixedLoadAllocated)}</p>
            <p className="preview-caption">
              Allocated to this recipe run · {capacityHint}
            </p>
          </>
        ) : (
          <p className="preview-caption preview-error">
            Enter positive numbers to preview allocation.
          </p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/" className="btn btn-ghost">
          Back
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
          Continue to recipe
        </button>
      </nav>
    </>
  );
}
