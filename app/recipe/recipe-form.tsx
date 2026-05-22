"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { runCosting } from "@/lib/costing";
import { formatMoney } from "@/lib/format";
import {
  CUPCAKES_PRESET,
  DEFAULT_RECIPE,
  emptyIngredientRow,
  emptyLaborRow,
  type IngredientRow,
  type LaborRow,
  type RecipeForm,
} from "@/lib/recipe";
import { loadWizardSession, saveRecipe } from "@/lib/session";
import { useWizardGuard } from "@/lib/use-wizard-guard";

export function RecipeForm() {
  const router = useRouter();
  const session = useWizardGuard("fixed");
  const [form, setForm] = useState<RecipeForm>(DEFAULT_RECIPE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadWizardSession();
    if (data?.recipe) setForm(data.recipe);
    setHydrated(true);
  }, []);

  const preview = useMemo(() => {
    if (!session?.fixedCharges || !hydrated) return null;
    return runCosting(session.fixedCharges, form);
  }, [session, form, hydrated]);

  function updateForm(next: RecipeForm) {
    setForm(next);
  }

  function updateIngredient(id: string, patch: Partial<IngredientRow>) {
    updateForm({
      ...form,
      ingredients: form.ingredients.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    });
  }

  function updateLabor(id: string, patch: Partial<LaborRow>) {
    updateForm({
      ...form,
      laborPhases: form.laborPhases.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    });
  }

  function removeIngredient(id: string) {
    if (form.ingredients.length <= 1) return;
    updateForm({
      ...form,
      ingredients: form.ingredients.filter((r) => r.id !== id),
    });
  }

  function removeLabor(id: string) {
    if (form.laborPhases.length <= 1) return;
    updateForm({
      ...form,
      laborPhases: form.laborPhases.filter((r) => r.id !== id),
    });
  }

  function handleContinue() {
    if (!preview || !session?.fixedCharges) return;
    saveRecipe(form);
    router.push("/results");
  }

  if (!session) return null;

  return (
    <>
      <div className="toolbar">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => updateForm(CUPCAKES_PRESET)}
        >
          Load cupcakes preset
        </button>
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span className="field-label">Recipe name</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm({ ...form, name: e.target.value })}
            placeholder="e.g. Cupcakes"
          />
        </label>

        <fieldset className="field-group">
          <legend className="field-group-legend">Ingredients</legend>
          <p className="field-hint field-hint-block">
            Quantity × cost per unit (same units as your spreadsheet).
          </p>
          <table className="data-table">
            <thead>
              <tr>
                <th>Qty</th>
                <th>Cost / unit</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {form.ingredients.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="any"
                      value={row.quantity}
                      onChange={(e) =>
                        updateIngredient(row.id, { quantity: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={row.costPerUnit}
                      onChange={(e) =>
                        updateIngredient(row.id, {
                          costPerUnit: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeIngredient(row.id)}
                      aria-label="Remove ingredient"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() =>
              updateForm({
                ...form,
                ingredients: [...form.ingredients, emptyIngredientRow()],
              })
            }
          >
            + Ingredient
          </button>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group-legend">Labor phases</legend>
          <table className="data-table">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Hours</th>
                <th>Rate / h</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {form.laborPhases.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="text"
                      value={row.label}
                      onChange={(e) =>
                        updateLabor(row.id, { label: e.target.value })
                      }
                      placeholder="Mix, decorate…"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.25"
                      value={row.hours}
                      onChange={(e) =>
                        updateLabor(row.id, { hours: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.01"
                      value={row.hourlyRate}
                      onChange={(e) =>
                        updateLabor(row.id, { hourlyRate: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => removeLabor(row.id)}
                      aria-label="Remove phase"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() =>
              updateForm({
                ...form,
                laborPhases: [...form.laborPhases, emptyLaborRow()],
              })
            }
          >
            + Labor phase
          </button>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span className="field-label">Waste %</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="99"
              step="0.1"
              value={form.wastePercent}
              onChange={(e) =>
                updateForm({ ...form, wastePercent: e.target.value })
              }
            />
          </label>
          <label className="field">
            <span className="field-label">Target margin %</span>
            <span className="field-hint">On selling price, not markup on cost</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="99"
              step="0.1"
              value={form.marginPercent}
              onChange={(e) =>
                updateForm({ ...form, marginPercent: e.target.value })
              }
            />
          </label>
        </div>
      </form>

      <section className="card preview-card" aria-live="polite">
        <h2>Batch preview</h2>
        {preview ? (
          <dl className="preview-dl">
            <dt>Materials</dt>
            <dd>{formatMoney(preview.result.directMaterials)}</dd>
            <dt>Labor</dt>
            <dd>{formatMoney(preview.result.directLabor)}</dd>
            <dt>Fixed load</dt>
            <dd>{formatMoney(preview.result.fixedLoadAllocated)}</dd>
            <dt className="preview-dl-total">Full cost</dt>
            <dd className="preview-dl-total">{formatMoney(preview.result.fullCost)}</dd>
          </dl>
        ) : (
          <p className="preview-caption preview-error">
            Fill ingredients, labor, waste and margin to preview.
          </p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/fixed-charges" className="btn btn-ghost">
          Back
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!preview}
          onClick={handleContinue}
        >
          View results
        </button>
      </nav>
    </>
  );
}
