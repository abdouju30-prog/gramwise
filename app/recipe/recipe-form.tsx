"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { runCosting } from "@/lib/costing";
import { convertFromMad, CURRENCY_LABELS } from "@/lib/currency";
import { INGREDIENT_QUANTITY_UNITS } from "@/lib/ingredient-units";
import type { ParsedIngredientLine } from "@/lib/ingredient-import";
import {
  CUPCAKES_PRESET,
  DEFAULT_RECIPE,
  emptyIngredientRow,
  ingredientRowsFromNames,
  mergeRecipeDefaults,
  normalizeIngredientRow,
  normalizeRecipeForm,
  parsedLinesToRows,
  emptyLaborRow,
  ingredientLineCostMad,
  type IngredientRow,
  type LaborRow,
  type RecipeForm,
} from "@/lib/recipe";
import { defaultPriceUnit, resolvePriceUnit } from "@/lib/ingredient-units";
import { IngredientImportPanel } from "./ingredient-import-panel";
import { RecipeCapacitySection } from "./recipe-capacity-section";
import {
  RecipeTitleHeader,
  RECIPE_PICKER_CUPCAKES,
  isSavedRecipePicker,
} from "./recipe-title-header";
import {
  deleteSavedRecipe,
  loadRecipeLibrary,
  recipeHasSaveableContent,
  saveRecipeToLibrary,
  updateSavedRecipe,
} from "@/lib/recipe-library";
import {
  extractLegacyCapacity,
  monthlyFixedTotal,
  normalizeFixedChargesForm,
} from "@/lib/fixed-charges";
import {
  parseSmigHourlyMad,
  smigLaborOptionsFromFixed,
} from "@/lib/smic";
import {
  applyCatalogToRow,
  applyCatalogToRows,
  loadIngredientCatalog,
} from "@/lib/ingredient-catalog";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import {
  loadWizardSession,
  RECIPE_DEFAULTS_GENERATION,
  saveFixedCharges,
  saveRecipe,
} from "@/lib/session";
import { useWizardGuard } from "@/lib/use-wizard-guard";

export function RecipeForm() {
  const m = useMessages();
  const { entryCurrency, formatMoney } = useLocale();
  const router = useRouter();
  const session = useWizardGuard("fixed");
  const [form, setForm] = useState<RecipeForm>(DEFAULT_RECIPE);
  const [hydrated, setHydrated] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [libraryRefresh, setLibraryRefresh] = useState(0);
  const [picker, setPicker] = useState("");
  const editingSaved = isSavedRecipePicker(picker);
  const canSave = recipeHasSaveableContent(form);
  const catalog = useMemo(() => loadIngredientCatalog(), [libraryRefresh]);

  useEffect(() => {
    const data = loadWizardSession();
    const names = m.recipe.defaultIngredientNames;
    const laborLabels = m.recipe.defaultLaborPhaseLabels;

    const legacyCapacity = extractLegacyCapacity(data?.fixedCharges);
    let base = normalizeRecipeForm(data?.recipe ?? {});
    if (!data?.recipe?.capacityMode && legacyCapacity) {
      base = { ...base, ...legacyCapacity };
      if (data?.fixedCharges) {
        saveFixedCharges(normalizeFixedChargesForm(data.fixedCharges));
      }
    }
    const staleGeneration =
      (data?.recipeDefaultsGeneration ?? 0) < RECIPE_DEFAULTS_GENERATION;
    const next = mergeRecipeDefaults(
      {
        ...base,
        ingredients: base.ingredients.map((row) =>
          normalizeIngredientRow({
            ...row,
            name: row.name ?? "",
          }),
        ),
      },
      { ingredientNames: names, laborLabels },
    );
    const defaultsChanged =
      next.ingredients.length !== base.ingredients.length ||
      next.ingredients.some((row, i) => row.name !== base.ingredients[i]?.name) ||
      next.laborPhases.length !== base.laborPhases.length ||
      next.laborPhases.some(
        (row, i) => row.label !== base.laborPhases[i]?.label,
      );

    const withCatalog = {
      ...next,
      ingredients: applyCatalogToRows(next.ingredients, loadIngredientCatalog()),
    };

    setForm(withCatalog);
    if (data?.fixedCharges && (staleGeneration || defaultsChanged)) {
      saveRecipe(withCatalog, {
        recipeDefaultsGeneration: RECIPE_DEFAULTS_GENERATION,
      });
    }
    setHydrated(true);
  }, [m.recipe.defaultIngredientNames, m.recipe.defaultLaborPhaseLabels]);

  const preview = useMemo(() => {
    if (!session?.fixedCharges || !hydrated) return null;
    return runCosting(session.fixedCharges, form, entryCurrency);
  }, [session, form, hydrated, entryCurrency]);

  const monthlyTotal = useMemo(
    () =>
      session?.fixedCharges
        ? monthlyFixedTotal(session.fixedCharges.chargeLines, entryCurrency)
        : null,
    [session?.fixedCharges, entryCurrency],
  );

  const smigHourly = useMemo(
    () =>
      session?.fixedCharges
        ? parseSmigHourlyMad(session.fixedCharges, entryCurrency)
        : null,
    [session?.fixedCharges, entryCurrency],
  );

  const smigLaborOptions = useMemo(
    () =>
      session?.fixedCharges
        ? smigLaborOptionsFromFixed(
            session.fixedCharges,
            form.laborByOwner,
            entryCurrency,
          )
        : undefined,
    [session?.fixedCharges, form.laborByOwner, entryCurrency],
  );

  const smigRateDisplay =
    smigHourly === null ? "—" : formatMoney(smigHourly);

  function updateForm(next: RecipeForm) {
    setForm(next);
  }

  function updateRecipeField<K extends keyof RecipeForm>(
    key: K,
    value: RecipeForm[K],
  ) {
    updateForm({ ...form, [key]: value });
  }

  function updateIngredient(id: string, patch: Partial<IngredientRow>) {
    updateForm({
      ...form,
      ingredients: form.ingredients.map((r) => {
        if (r.id !== id) return r;
        let row = { ...r, ...patch };
        if (patch.name !== undefined) {
          row = applyCatalogToRow(row, catalog);
        }
        return row;
      }),
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

  function applyImportedIngredients(lines: ParsedIngredientLine[]) {
    updateForm({
      ...form,
      ingredients: applyCatalogToRows(parsedLinesToRows(lines), catalog),
    });
  }

  function handleNewRecipe() {
    const next = mergeRecipeDefaults(
      { ...DEFAULT_RECIPE, name: "" },
      {
        ingredientNames: m.recipe.defaultIngredientNames,
        laborLabels: m.recipe.defaultLaborPhaseLabels,
      },
    );
    updateForm(next);
    saveRecipe(next);
  }

  function handlePickRecipe(recipe: RecipeForm) {
    const loaded = normalizeRecipeForm({
      ...recipe,
      ingredients: recipe.ingredients.map((row) => normalizeIngredientRow(row)),
    });
    const withCatalog = {
      ...loaded,
      ingredients: applyCatalogToRows(loaded.ingredients, catalog),
    };
    updateForm(withCatalog);
    saveRecipe(withCatalog);
  }

  function handlePickerChange(value: string) {
    setPicker(value);
    if (value === "") {
      handleNewRecipe();
      return;
    }
    if (value === RECIPE_PICKER_CUPCAKES) {
      handlePickRecipe(CUPCAKES_PRESET);
      return;
    }
    const entry = loadRecipeLibrary().find((e) => e.id === value);
    if (entry) handlePickRecipe(entry.recipe);
  }

  function handleDeleteSaved() {
    if (!isSavedRecipePicker(picker)) return;
    if (!deleteSavedRecipe(picker)) return;
    setLibraryRefresh((k) => k + 1);
    setPicker("");
    handleNewRecipe();
  }

  function handleSave() {
    if (!canSave) return;
    saveRecipe(form);

    if (editingSaved) {
      updateSavedRecipe(picker, form);
      setLibraryRefresh((k) => k + 1);
      setSaveNotice(m.recipe.updatedToast);
      window.setTimeout(() => setSaveNotice(null), 4000);
      return;
    }

    saveRecipeToLibrary(form);
    const next = mergeRecipeDefaults(
      { ...DEFAULT_RECIPE, name: "" },
      {
        ingredientNames: m.recipe.defaultIngredientNames,
        laborLabels: m.recipe.defaultLaborPhaseLabels,
      },
    );
    setForm(next);
    saveRecipe(next);
    setPicker("");
    setLibraryRefresh((k) => k + 1);
    setSaveNotice(m.recipe.savedToast);
    window.setTimeout(() => setSaveNotice(null), 4000);
  }

  function handleContinue() {
    if (!preview || !session?.fixedCharges) return;
    saveRecipe(form);
    router.push("/results");
  }

  if (!session) return null;

  return (
    <>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="field-group recipe-composer">
          <RecipeTitleHeader
            picker={picker}
            onPickerChange={handlePickerChange}
            name={form.name}
            onNameChange={(name) => updateForm({ ...form, name })}
            onDeleteSaved={handleDeleteSaved}
            refreshKey={libraryRefresh}
          />

              <div className="recipe-composer-section">
                <p className="recipe-section-label">{m.recipe.ingredientsLegend}</p>
                <IngredientImportPanel onApply={applyImportedIngredients} />
                <p className="field-hint field-hint-block">{m.recipe.ingredientsHint}</p>
                <div className="ingredient-grid" role="table">
            <div className="ingredient-grid-head" role="row">
              <span role="columnheader">{m.recipe.ingredientName}</span>
              <span role="columnheader">{m.recipe.qty}</span>
              <span role="columnheader">{m.recipe.qtyUnit}</span>
              <span role="columnheader">
                {m.recipe.costPerUnit} ({CURRENCY_LABELS[entryCurrency]})
              </span>
              <span role="columnheader">{m.recipe.lineCost}</span>
              <span className="ingredient-grid-actions-head" aria-hidden />
            </div>
            {form.ingredients.map((row) => {
              const priceUnit = resolvePriceUnit(row.quantityUnit, row.priceUnit);
              const priceUnitLabel = m.recipe.import.units[priceUnit];
              const lineCost = ingredientLineCostMad(row, entryCurrency);
              return (
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
                <select
                  role="cell"
                  aria-label={m.recipe.qtyUnit}
                  value={row.quantityUnit}
                  onChange={(e) => {
                    const quantityUnit = e.target
                      .value as IngredientRow["quantityUnit"];
                    updateIngredient(row.id, {
                      quantityUnit,
                      priceUnit: defaultPriceUnit(quantityUnit),
                    });
                  }}
                >
                  {INGREDIENT_QUANTITY_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {m.recipe.import.units[u]}
                    </option>
                  ))}
                </select>
                <div className="ingredient-price-cell" role="cell">
                  <input
                    type="text"
                    inputMode="decimal"
                    role="cell"
                    aria-label={`${m.recipe.costPerUnit} / ${priceUnitLabel}`}
                    value={row.costPerUnit}
                    onChange={(e) =>
                      updateIngredient(row.id, {
                        costPerUnit: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                  <span className="ingredient-price-basis" aria-hidden>
                    / {priceUnitLabel}
                  </span>
                </div>
                <span
                  className="ingredient-line-cost"
                  role="cell"
                  aria-label={m.recipe.lineCost}
                >
                  {lineCost !== null ? formatMoney(lineCost) : "—"}
                </span>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => removeIngredient(row.id)}
                  aria-label={m.recipe.removeIngredient}
                >
                  ×
                </button>
              </div>
            );
            })}
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
              </div>

              <div className="recipe-composer-section">
                <p className="recipe-section-label">{m.recipe.laborLegend}</p>
                <p className="field-hint field-hint-block">{m.recipe.laborHint}</p>
                <p className="field-hint field-hint-block">{m.recipe.laborHintActive}</p>
                <p className="field-hint field-hint-block">{m.recipe.laborPassiveExample}</p>
                <p className="field-hint field-hint-block">
                  {m.recipe.laborSmigRateNote.replace("{rate}", smigRateDisplay)}
                </p>
                <label className="field field-checkbox">
                  <input
                    type="checkbox"
                    checked={form.laborByOwner}
                    onChange={(e) =>
                      updateRecipeField("laborByOwner", e.target.checked)
                    }
                  />
                  <span>{m.recipe.laborByOwner}</span>
                </label>
                <p className="field-hint field-hint-block">{m.recipe.laborByOwnerHint}</p>
                <div className="table-scroll">
          <table className="data-table data-table--recipe">
            <thead>
              <tr>
                <th>{m.recipe.phase}</th>
                <th>{m.recipe.activeHours}</th>
                <th>{m.recipe.ratePerHour.replace("MAD", CURRENCY_LABELS[entryCurrency])}</th>
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
                      placeholder={m.recipe.hoursPlaceholder}
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
                      placeholder={
                        smigHourly === null
                          ? m.recipe.ratePlaceholder
                          : m.recipe.rateSmigDefaultHint
                      }
                      title={
                        form.laborByOwner && smigHourly !== null
                          ? m.recipe.laborByOwnerHint
                          : undefined
                      }
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
                laborPhases: [
                  ...form.laborPhases,
                  emptyLaborRow(
                    smigHourly === null
                      ? ""
                      : String(
                          Math.round(
                            convertFromMad(smigHourly, entryCurrency) * 100,
                          ) / 100,
                        ),
                  ),
                ],
              })
            }
          >
            {m.recipe.addLabor}
          </button>
              </div>

              <RecipeCapacitySection
                form={form}
                monthlyTotal={monthlyTotal}
                fixedLoadAllocated={preview?.result.fixedLoadAllocated ?? null}
                smigLaborOptions={smigLaborOptions}
                onUpdate={(patch) => updateForm({ ...form, ...patch })}
              />

              <div className="recipe-composer-section">
                <p className="recipe-section-label">{m.recipe.pricingLegend}</p>
                <div className="field-row">
          <label className="field">
            <span className="field-label">{m.recipe.wasteLabel}</span>
            <span className="field-hint">{m.recipe.wasteHint}</span>
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
              </div>
        </fieldset>
      </form>

      <div className="recipe-save-bar">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!canSave}
          onClick={handleSave}
        >
          {editingSaved ? m.recipe.saveChanges : m.recipe.saveAndNew}
        </button>
        {saveNotice ? (
          <p className="tip-box" role="status">
            {saveNotice}
          </p>
        ) : null}
      </div>

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
