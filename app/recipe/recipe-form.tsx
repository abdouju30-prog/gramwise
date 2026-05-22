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
  ingredientRowsFromNames,
  mergeRecipeIngredientDefaults,
  emptyLaborRow,
  type IngredientRow,
  type LaborRow,
  type RecipeForm,
} from "@/lib/recipe";
import { useMessages } from "@/lib/i18n/locale-provider";
import {
  loadWizardSession,
  RECIPE_DEFAULTS_GENERATION,
  saveRecipe,
} from "@/lib/session";
import { useWizardGuard } from "@/lib/use-wizard-guard";

export function RecipeForm() {
  const m = useMessages();
  const router = useRouter();
  const session = useWizardGuard("fixed");
  const [form, setForm] = useState<RecipeForm>(DEFAULT_RECIPE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadWizardSession();
    const names = m.recipe.defaultIngredientNames;
    const base: RecipeForm = data?.recipe ?? DEFAULT_RECIPE;
    const staleGeneration =
      (data?.recipeDefaultsGeneration ?? 0) < RECIPE_DEFAULTS_GENERATION;
    const next = mergeRecipeIngredientDefaults(
      {
        ...base,
        ingredients: base.ingredients.map((row) => ({
          ...row,
          name: row.name ?? "",
        })),
      },
      names,
    );
    const ingredientsChanged =
      next.ingredients.length !== base.ingredients.length ||
      next.ingredients.some((row, i) => row.name !== base.ingredients[i]?.name);

    setForm(next);
    if (data?.fixedCharges && (staleGeneration || ingredientsChanged)) {
      saveRecipe(next, {
        recipeDefaultsGeneration: RECIPE_DEFAULTS_GENERATION,
      });
    }
    setHydrated(true);
  }, [m.recipe.defaultIngredientNames]);

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
          {m.recipe.loadPreset}
        </button>
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <label className="field">
          <span className="field-label">{m.recipe.nameLabel}</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateForm({ ...form, name: e.target.value })}
            placeholder={m.recipe.namePlaceholder}
          />
        </label>

        <fieldset className="field-group">
          <legend className="field-group-legend">{m.recipe.ingredientsLegend}</legend>
          <p className="field-hint field-hint-block">{m.recipe.ingredientsHint}</p>
          <div className="ingredient-grid" role="table">
            <div className="ingredient-grid-head" role="row">
              <span role="columnheader">{m.recipe.ingredientName}</span>
              <span role="columnheader">{m.recipe.qty}</span>
              <span role="columnheader">{m.recipe.costPerUnit}</span>
              <span className="ingredient-grid-actions-head" aria-hidden />
            </div>
            {form.ingredients.map((row) => (
              <div key={row.id} className="ingredient-grid-row" role="row">
                <input
                  type="text"
                  role="cell"
                  aria-label={m.recipe.ingredientName}
                  value={row.name ?? ""}
                  onChange={(e) =>
                    updateIngredient(row.id, { name: e.target.value })
                  }
                  placeholder={m.recipe.ingredientNamePlaceholder}
                />
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="any"
                  role="cell"
                  aria-label={m.recipe.qty}
                  value={row.quantity}
                  onChange={(e) =>
                    updateIngredient(row.id, { quantity: e.target.value })
                  }
                  placeholder="0"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  role="cell"
                  aria-label={m.recipe.costPerUnit}
                  value={row.costPerUnit}
                  onChange={(e) =>
                    updateIngredient(row.id, {
                      costPerUnit: e.target.value,
                    })
                  }
                  placeholder="0"
                />
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => removeIngredient(row.id)}
                  aria-label={m.recipe.removeIngredient}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
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
            {m.recipe.addIngredient}
          </button>
        </fieldset>

        <fieldset className="field-group">
          <legend className="field-group-legend">{m.recipe.laborLegend}</legend>
          <div className="table-scroll">
          <table className="data-table data-table--recipe">
            <thead>
              <tr>
                <th>{m.recipe.phase}</th>
                <th>{m.recipe.hours}</th>
                <th>{m.recipe.ratePerHour}</th>
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
                      placeholder={m.recipe.phasePlaceholder}
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
                      aria-label={m.recipe.removePhase}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
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
            {m.recipe.addLabor}
          </button>
        </fieldset>

        <div className="field-row">
          <label className="field">
            <span className="field-label">{m.recipe.wasteLabel}</span>
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
            <span className="field-label">{m.recipe.marginLabel}</span>
            <span className="field-hint">{m.recipe.marginHint}</span>
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
        <h2>{m.recipe.previewTitle}</h2>
        {preview ? (
          <dl className="preview-dl">
            <dt>{m.recipe.materials}</dt>
            <dd>{formatMoney(preview.result.directMaterials)}</dd>
            <dt>{m.recipe.labor}</dt>
            <dd>{formatMoney(preview.result.directLabor)}</dd>
            <dt>{m.recipe.fixedLoad}</dt>
            <dd>{formatMoney(preview.result.fixedLoadAllocated)}</dd>
            <dt className="preview-dl-total">{m.recipe.fullCost}</dt>
            <dd className="preview-dl-total">{formatMoney(preview.result.fullCost)}</dd>
          </dl>
        ) : (
          <p className="preview-caption preview-error">{m.recipe.previewError}</p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/fixed-charges" className="btn btn-ghost">
          {m.recipe.back}
        </Link>
        <button
          type="button"
          className="btn btn-primary"
          disabled={!preview}
          onClick={handleContinue}
        >
          {m.recipe.viewResults}
        </button>
      </nav>
    </>
  );
}
