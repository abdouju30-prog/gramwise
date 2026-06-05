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

// Ingredient name → emoji hint (best-effort, falls back to 🥄)
const INGREDIENT_ICON: Record<string, string> = {
  flour: "🌾", farine: "🌾",
  butter: "🧈", beurre: "🧈",
  egg: "🥚", eggs: "🥚", oeuf: "🥚", oeufs: "🥚",
  milk: "🥛", lait: "🥛",
  sugar: "🍬", sucre: "🍬",
  cream: "🍶", crème: "🍶",
  chocolate: "🍫", chocolat: "🍫",
  salt: "🧂", sel: "🧂",
  vanilla: "🌿", vanille: "🌿",
  yeast: "🧪", levure: "🧪",
};
function ingredientIcon(name: string): string {
  const key = name.toLowerCase().trim();
  for (const [k, v] of Object.entries(INGREDIENT_ICON)) {
    if (key.includes(k)) return v;
  }
  return "🥄";
}

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
      if (data?.fixedCharges) saveFixedCharges(normalizeFixedChargesForm(data.fixedCharges));
    }
    const staleGeneration = (data?.recipeDefaultsGeneration ?? 0) < RECIPE_DEFAULTS_GENERATION;
    const next = mergeRecipeDefaults(
      { ...base, ingredients: base.ingredients.map((row) => normalizeIngredientRow({ ...row, name: row.name ?? "" })) },
      { ingredientNames: names, laborLabels },
    );
    const defaultsChanged =
      next.ingredients.length !== base.ingredients.length ||
      next.ingredients.some((row, i) => row.name !== base.ingredients[i]?.name) ||
      next.laborPhases.length !== base.laborPhases.length ||
      next.laborPhases.some((row, i) => row.label !== base.laborPhases[i]?.label);
    const withCatalog = { ...next, ingredients: applyCatalogToRows(next.ingredients, loadIngredientCatalog()) };
    setForm(withCatalog);
    if (data?.fixedCharges && (staleGeneration || defaultsChanged)) saveRecipe(withCatalog, { recipeDefaultsGeneration: RECIPE_DEFAULTS_GENERATION });
    setHydrated(true);
  }, [m.recipe.defaultIngredientNames, m.recipe.defaultLaborPhaseLabels]);

  const preview = useMemo(() => {
    if (!session?.fixedCharges || !hydrated) return null;
    return runCosting(session.fixedCharges, form, entryCurrency);
  }, [session, form, hydrated, entryCurrency]);

  const monthlyTotal = useMemo(
    () => session?.fixedCharges ? monthlyFixedTotal(session.fixedCharges.chargeLines, entryCurrency) : null,
    [session?.fixedCharges, entryCurrency],
  );

  const smigHourly = useMemo(
    () => session?.fixedCharges ? parseSmigHourlyMad(session.fixedCharges, entryCurrency) : null,
    [session?.fixedCharges, entryCurrency],
  );

  const smigLaborOptions = useMemo(
    () => session?.fixedCharges ? smigLaborOptionsFromFixed(session.fixedCharges, form.laborByOwner, entryCurrency) : undefined,
    [session?.fixedCharges, form.laborByOwner, entryCurrency],
  );

  const smigRateDisplay = smigHourly === null ? "—" : formatMoney(smigHourly);

  // Proportion helpers
  const totalMaterialsCost = useMemo(() =>
    form.ingredients.reduce((sum, r) => sum + (ingredientLineCostMad(r, entryCurrency) ?? 0), 0),
    [form.ingredients, entryCurrency],
  );

  const totalLaborCost = useMemo(() =>
    form.laborPhases.reduce((sum, r) => {
      const h = parseFloat(r.hours.replace(",", ".")) || 0;
      const rt = parseFloat(r.hourlyRate) || (smigHourly ? convertFromMad(smigHourly, entryCurrency) : 0);
      return sum + h * rt;
    }, 0),
    [form.laborPhases, smigHourly, entryCurrency],
  );

  function updateForm(next: RecipeForm) { setForm(next); }
  function updateRecipeField<K extends keyof RecipeForm>(key: K, value: RecipeForm[K]) {
    updateForm({ ...form, [key]: value });
  }
  function updateIngredient(id: string, patch: Partial<IngredientRow>) {
    updateForm({
      ...form,
      ingredients: form.ingredients.map((r) => {
        if (r.id !== id) return r;
        let row = { ...r, ...patch };
        if (patch.name !== undefined) row = applyCatalogToRow(row, catalog);
        return row;
      }),
    });
  }
  function updateLabor(id: string, patch: Partial<LaborRow>) {
    updateForm({ ...form, laborPhases: form.laborPhases.map((r) => r.id === id ? { ...r, ...patch } : r) });
  }
  function removeIngredient(id: string) {
    if (form.ingredients.length <= 1) return;
    updateForm({ ...form, ingredients: form.ingredients.filter((r) => r.id !== id) });
  }
  function removeLabor(id: string) {
    if (form.laborPhases.length <= 1) return;
    updateForm({ ...form, laborPhases: form.laborPhases.filter((r) => r.id !== id) });
  }
  function applyImportedIngredients(lines: ParsedIngredientLine[]) {
    updateForm({ ...form, ingredients: applyCatalogToRows(parsedLinesToRows(lines), catalog) });
  }
  function handleNewRecipe() {
    const next = mergeRecipeDefaults({ ...DEFAULT_RECIPE, name: "" }, { ingredientNames: m.recipe.defaultIngredientNames, laborLabels: m.recipe.defaultLaborPhaseLabels });
    updateForm(next); saveRecipe(next);
  }
  function handlePickRecipe(recipe: RecipeForm) {
    const loaded = normalizeRecipeForm({ ...recipe, ingredients: recipe.ingredients.map((row) => normalizeIngredientRow(row)) });
    const withCatalog = { ...loaded, ingredients: applyCatalogToRows(loaded.ingredients, catalog) };
    updateForm(withCatalog); saveRecipe(withCatalog);
  }
  function handlePickerChange(value: string) {
    setPicker(value);
    if (value === "") { handleNewRecipe(); return; }
    if (value === RECIPE_PICKER_CUPCAKES) { handlePickRecipe(CUPCAKES_PRESET); return; }
    const entry = loadRecipeLibrary().find((e) => e.id === value);
    if (entry) handlePickRecipe(entry.recipe);
  }
  function handleDeleteSaved() {
    if (!isSavedRecipePicker(picker)) return;
    if (!deleteSavedRecipe(picker)) return;
    setLibraryRefresh((k) => k + 1); setPicker(""); handleNewRecipe();
  }
  function handleSave() {
    if (!canSave) return;
    saveRecipe(form);
    if (editingSaved) {
      updateSavedRecipe(picker, form); setLibraryRefresh((k) => k + 1);
      setSaveNotice(m.recipe.updatedToast); window.setTimeout(() => setSaveNotice(null), 4000); return;
    }
    saveRecipeToLibrary(form);
    const next = mergeRecipeDefaults({ ...DEFAULT_RECIPE, name: "" }, { ingredientNames: m.recipe.defaultIngredientNames, laborLabels: m.recipe.defaultLaborPhaseLabels });
    setForm(next); saveRecipe(next); setPicker(""); setLibraryRefresh((k) => k + 1);
    setSaveNotice(m.recipe.savedToast); window.setTimeout(() => setSaveNotice(null), 4000);
  }
  function handleContinue() {
    if (!preview || !session?.fixedCharges) return;
    saveRecipe(form); router.push("/results");
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

          {/* ── Ingredients ──────────────────────────────── */}
          <div className="recipe-composer-section">
            <p className="recipe-section-label">{m.recipe.ingredientsLegend}</p>
            <IngredientImportPanel onApply={applyImportedIngredients} />
            <p className="field-hint field-hint-block">{m.recipe.ingredientsHint}</p>

            <div className="budget-cards ingredient-cards" role="list">
              {form.ingredients.map((row) => {
                const priceUnit = resolvePriceUnit(row.quantityUnit, row.priceUnit);
                const priceUnitLabel = m.recipe.import.units[priceUnit];
                const lineCost = ingredientLineCostMad(row, entryCurrency);
                const pct = totalMaterialsCost > 0 && lineCost !== null
                  ? Math.min(100, Math.round((lineCost / totalMaterialsCost) * 100))
                  : 0;

                return (
                  <div key={row.id} className="budget-card ingredient-card" role="listitem">
                    <div className="budget-card-head">
                      <span className="budget-card-icon" aria-hidden="true">
                        {ingredientIcon(row.name ?? "")}
                      </span>
                      <input
                        type="text"
                        className="budget-card-name budget-card-name--editable"
                        value={row.name ?? ""}
                        onChange={(e) => updateIngredient(row.id, { name: e.target.value })}
                        placeholder={m.recipe.ingredientNamePlaceholder}
                        aria-label={m.recipe.ingredientName}
                      />
                      <button
                        type="button"
                        className="budget-card-remove"
                        onClick={() => removeIngredient(row.id)}
                        aria-label={m.recipe.removeIngredient}
                      >×</button>
                    </div>

                    <div className="ingredient-card-fields">
                      <input
                        type="text"
                        inputMode="decimal"
                        className="ingredient-card-qty"
                        value={row.quantity}
                        onChange={(e) => updateIngredient(row.id, { quantity: e.target.value })}
                        placeholder="0"
                        aria-label={m.recipe.qty}
                      />
                      <select
                        className="ingredient-card-unit"
                        value={row.quantityUnit}
                        aria-label={m.recipe.qtyUnit}
                        onChange={(e) => {
                          const quantityUnit = e.target.value as IngredientRow["quantityUnit"];
                          updateIngredient(row.id, { quantityUnit, priceUnit: defaultPriceUnit(quantityUnit) });
                        }}
                      >
                        {INGREDIENT_QUANTITY_UNITS.map((u) => (
                          <option key={u} value={u}>{m.recipe.import.units[u]}</option>
                        ))}
                      </select>
                      <span className="ingredient-card-sep" aria-hidden>·</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        className="ingredient-card-price"
                        value={row.costPerUnit}
                        onChange={(e) => updateIngredient(row.id, { costPerUnit: e.target.value })}
                        placeholder="0"
                        aria-label={`${m.recipe.costPerUnit} / ${priceUnitLabel}`}
                      />
                      <span className="ingredient-card-price-unit" aria-hidden>/{priceUnitLabel}</span>
                    </div>

                    <p className="ingredient-card-cost" aria-label={m.recipe.lineCost}>
                      {lineCost !== null ? formatMoney(lineCost) : "—"}
                    </p>
                    <div className="budget-card-bar-track" aria-hidden="true">
                      <div className="budget-card-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="budget-card-pct" aria-hidden="true">
                      {pct > 0 ? `${pct}%` : "—"}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm budget-add-btn"
              onClick={() => updateForm({ ...form, ingredients: [...form.ingredients, emptyIngredientRow()] })}
            >
              {m.recipe.addIngredient}
            </button>
          </div>

          {/* ── Labor ────────────────────────────────────── */}
          <div className="recipe-composer-section">
            <p className="recipe-section-label">{m.recipe.laborLegend}</p>
            <p className="field-hint field-hint-block">{m.recipe.laborHint}</p>
            <p className="field-hint field-hint-block">{m.recipe.laborHintActive}</p>
            <p className={`field-hint field-hint-block${smigHourly === null ? " preview-error" : ""}`}>
              {smigHourly === null
                ? m.recipe.laborSmigMissing
                : m.recipe.laborSmigRateNote.replace("{rate}", smigRateDisplay)}
            </p>
            <label className="field field-checkbox" style={{ marginBottom: "1rem" }}>
              <input
                type="checkbox"
                checked={form.laborByOwner}
                onChange={(e) => updateRecipeField("laborByOwner", e.target.checked)}
              />
              <span>{m.recipe.laborByOwner}</span>
            </label>

            <div className="budget-cards labor-cards" role="list">
              {form.laborPhases.map((row) => {
                const h = parseFloat(row.hours.replace(",", ".")) || 0;
                const rt = parseFloat(row.hourlyRate) || (smigHourly ? convertFromMad(smigHourly, entryCurrency) : 0);
                const lineTotal = h * rt;
                const pct = totalLaborCost > 0
                  ? Math.min(100, Math.round((lineTotal / totalLaborCost) * 100))
                  : 0;

                return (
                  <div key={row.id} className="budget-card labor-card" role="listitem">
                    <div className="budget-card-head">
                      <span className="budget-card-icon" aria-hidden="true">⏱️</span>
                      <input
                        type="text"
                        className="budget-card-name budget-card-name--editable"
                        value={row.label}
                        onChange={(e) => updateLabor(row.id, { label: e.target.value })}
                        placeholder={m.recipe.phasePlaceholder}
                        aria-label={m.recipe.phase}
                      />
                      <button
                        type="button"
                        className="budget-card-remove"
                        onClick={() => removeLabor(row.id)}
                        aria-label={m.recipe.removePhase}
                      >×</button>
                    </div>

                    <div className="labor-card-metrics">
                      <div className="labor-card-hours-wrap">
                        <input
                          type="text"
                          inputMode="decimal"
                          className="budget-card-input labor-card-hours"
                          value={row.hours}
                          onChange={(e) => updateLabor(row.id, { hours: e.target.value })}
                          placeholder={m.recipe.hoursPlaceholder}
                          aria-label={m.recipe.activeHours}
                        />
                        <span className="labor-card-unit" aria-hidden>h</span>
                      </div>
                      <div className="labor-card-rate-wrap">
                        <input
                          type="text"
                          inputMode="decimal"
                          className="labor-card-rate"
                          value={row.hourlyRate}
                          onChange={(e) => updateLabor(row.id, { hourlyRate: e.target.value })}
                          placeholder={smigHourly === null ? m.recipe.ratePlaceholder : m.recipe.rateSmigDefaultHint}
                          aria-label={m.recipe.ratePerHour}
                        />
                        <span className="labor-card-rate-unit" aria-hidden>
                          /{CURRENCY_LABELS[entryCurrency]}·h
                        </span>
                      </div>
                    </div>

                    <p className="ingredient-card-cost">
                      {lineTotal > 0 ? formatMoney(lineTotal) : "—"}
                    </p>
                    <div className="budget-card-bar-track" aria-hidden="true">
                      <div className="budget-card-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="budget-card-pct" aria-hidden="true">
                      {pct > 0 ? `${pct}%` : "—"}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="btn btn-ghost btn-sm budget-add-btn"
              onClick={() => updateForm({
                ...form,
                laborPhases: [...form.laborPhases, emptyLaborRow(
                  smigHourly === null ? "" : String(Math.round(convertFromMad(smigHourly, entryCurrency) * 100) / 100)
                )],
              })}
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

          {/* ── Waste & Margin ───────────────────────────── */}
          <div className="recipe-composer-section">
            <p className="recipe-section-label">{m.recipe.pricingLegend}</p>
            <div className="budget-cards pricing-metric-cards">
              {/* Waste */}
              <div className="budget-card">
                <div className="budget-card-head">
                  <span className="budget-card-icon" aria-hidden="true">🗑️</span>
                  <span className="budget-card-name">{m.recipe.wasteLabel}</span>
                </div>
                <div className="budget-card-amount-row">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="99"
                    step="0.1"
                    className="budget-card-input"
                    value={form.wastePercent}
                    onChange={(e) => updateForm({ ...form, wastePercent: e.target.value })}
                    aria-label={m.recipe.wasteLabel}
                  />
                  <span className="budget-card-currency">%</span>
                </div>
                <p className="field-hint" style={{ marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                  {m.recipe.wasteHint}
                </p>
                <div className="budget-card-bar-track" aria-hidden="true">
                  <div
                    className="budget-card-bar-fill"
                    style={{ width: `${Math.min(100, parseFloat(form.wastePercent) || 0)}%` }}
                  />
                </div>
                <p className="budget-card-pct" aria-hidden="true">
                  {form.wastePercent || "0"}%
                </p>
              </div>

              {/* Margin */}
              <div className="budget-card">
                <div className="budget-card-head">
                  <span className="budget-card-icon" aria-hidden="true">💰</span>
                  <span className="budget-card-name">{m.recipe.marginLabel}</span>
                </div>
                <div className="budget-card-amount-row">
                  <input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="99"
                    step="0.1"
                    className="budget-card-input"
                    value={form.marginPercent}
                    onChange={(e) => updateForm({ ...form, marginPercent: e.target.value })}
                    aria-label={m.recipe.marginLabel}
                  />
                  <span className="budget-card-currency">%</span>
                </div>
                <p className="field-hint" style={{ marginBottom: "0.5rem", fontSize: "0.65rem" }}>
                  {m.recipe.marginHint}
                </p>
                <div className="budget-card-bar-track" aria-hidden="true">
                  <div
                    className="budget-card-bar-fill budget-card-bar-fill--margin"
                    style={{ width: `${Math.min(100, parseFloat(form.marginPercent) || 0)}%` }}
                  />
                </div>
                <p className="budget-card-pct" aria-hidden="true">
                  {form.marginPercent || "0"}%
                </p>
              </div>
            </div>
          </div>
        </fieldset>
      </form>

      {/* Save bar */}
      <div className="recipe-save-bar">
        <button type="button" className="btn btn-primary" disabled={!canSave} onClick={handleSave}>
          {editingSaved ? m.recipe.saveChanges : m.recipe.saveAndNew}
        </button>
        {saveNotice ? <p className="tip-box" role="status">{saveNotice}</p> : null}
      </div>

      {/* Preview card */}
      <section className="card card-dark preview-card" aria-live="polite">
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

      <nav className="step-nav step-nav--wizard">
        <Link href="/fixed-charges" className="btn btn-ghost">{m.recipe.back}</Link>
        <Link href="/monthly-report" className="btn btn-ghost">{m.results.viewMonthlyReport}</Link>
        <button type="button" className="btn btn-primary" disabled={!preview} onClick={handleContinue}>
          {m.recipe.viewResults}
        </button>
      </nav>
    </>
  );
}
