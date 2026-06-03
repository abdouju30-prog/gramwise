"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  createCustomChargeLine,
  DEFAULT_FIXED_CHARGES,
  normalizeFixedChargesForm,
  monthlyFixedTotal,
  type ChargeLinePreset,
  type FixedChargeLine,
  type FixedChargesForm,
} from "@/lib/fixed-charges";
import { CURRENCY_LABELS } from "@/lib/currency";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import type { Messages } from "@/lib/i18n/types";
import { loadWizardSession, saveFixedCharges } from "@/lib/session";
import { IngredientCatalogSection } from "./ingredient-catalog-section";

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
  const { entryCurrency, formatMoney } = useLocale();
  const router = useRouter();
  const [form, setForm] = useState<FixedChargesForm>(DEFAULT_FIXED_CHARGES);

  useEffect(() => {
    const session = loadWizardSession();
    const saved = session?.fixedCharges;
    setForm(
      saved ? normalizeFixedChargesForm(saved) : DEFAULT_FIXED_CHARGES,
    );
  }, []);

  const monthlyTotal = useMemo(
    () => monthlyFixedTotal(form.chargeLines, entryCurrency),
    [form.chargeLines, entryCurrency],
  );

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
    setForm((prev) => {
      if (prev.chargeLines.length <= 1) return prev;
      return {
        ...prev,
        chargeLines: prev.chargeLines.filter((line) => line.id !== id),
      };
    });
  }

  function chargeLineLabel(line: FixedChargeLine): string {
    return line.preset === "custom"
      ? line.customLabel?.trim() || m.fixed.chargeCustomPlaceholder
      : presetLabel(line.preset, m.fixed);
  }

  const totalDisplay =
    monthlyTotal === null ? "—" : formatMoney(monthlyTotal);

  const canContinue = monthlyTotal !== null && monthlyTotal > 0;

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
                    {CURRENCY_LABELS[entryCurrency]}
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
                    aria-label={`${chargeLineLabel(line)} — ${m.fixed.chargeAmount}`}
                  />
                </div>
                {form.chargeLines.length > 1 ? (
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeChargeLine(line.id)}
                    aria-label={`${m.fixed.removeChargeLine} — ${chargeLineLabel(line)}`}
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

        <IngredientCatalogSection />
      </form>

      <section className="card preview-card" aria-live="polite">
        <h2>{m.fixed.monthlyTotalLabel}</h2>
        {canContinue ? (
          <>
            <p className="preview-value">{totalDisplay}</p>
            <p className="preview-caption">{m.fixed.monthlyPreviewCaption}</p>
          </>
        ) : (
          <p className="preview-caption preview-error">{m.fixed.monthlyPreviewError}</p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/start" className="btn btn-ghost">
          {m.fixed.back}
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canContinue}
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
