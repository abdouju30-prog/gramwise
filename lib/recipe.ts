import type { IngredientLine, LaborPhase } from "@/engine/types";
import {
  type IngredientQuantityUnit,
  isIngredientQuantityUnit,
} from "@/lib/ingredient-units";
import type { DisplayCurrency } from "@/lib/currency";
import { parseNonNegativeInMad } from "@/lib/parse";

export type IngredientRow = {
  id: string;
  name: string;
  quantity: string;
  quantityUnit: IngredientQuantityUnit;
  costPerUnit: string;
};

export type LaborRow = {
  id: string;
  label: string;
  hours: string;
  hourlyRate: string;
};

export type RecipeForm = {
  name: string;
  ingredients: IngredientRow[];
  laborPhases: LaborRow[];
  wastePercent: string;
  marginPercent: string;
};

function rowId(): string {
  return crypto.randomUUID();
}

export const CUPCAKES_PRESET: RecipeForm = {
  name: "Cupcakes",
  ingredients: [
    { id: "1", name: "Flour", quantity: "0.8", quantityUnit: "kg", costPerUnit: "0.45" },
    { id: "2", name: "Sugar", quantity: "0.6", quantityUnit: "kg", costPerUnit: "0.65" },
    { id: "3", name: "Butter", quantity: "0.5", quantityUnit: "kg", costPerUnit: "6.2" },
    { id: "4", name: "Eggs", quantity: "6", quantityUnit: "unit", costPerUnit: "0.28" },
    { id: "5", name: "Milk", quantity: "0.4", quantityUnit: "L", costPerUnit: "0.9" },
    { id: "6", name: "Vanilla", quantity: "0.05", quantityUnit: "L", costPerUnit: "3.0" },
  ],
  laborPhases: [
    { id: "l1", label: "Mix & bake", hours: "1", hourlyRate: "18" },
    { id: "l2", label: "Decorate", hours: "0.75", hourlyRate: "18" },
    { id: "l3", label: "Pack", hours: "0.5", hourlyRate: "15" },
  ],
  wastePercent: "3",
  marginPercent: "40",
};

export function ingredientRowsFromNames(names: readonly string[]): IngredientRow[] {
  return names.map((name) => ({
    id: rowId(),
    name,
    quantity: "",
    quantityUnit: "kg",
    costPerUnit: "",
  }));
}

/** True when the user has not entered real ingredient costing data yet. */
export function needsDefaultIngredientRows(rows: IngredientRow[]): boolean {
  if (!rows.length) return true;
  return !rows.some((row) => {
    if (row.name?.trim()) return true;
    const q = Number.parseFloat(row.quantity);
    const c = Number.parseFloat(row.costPerUnit);
    return (
      (Number.isFinite(q) && q > 0) ||
      (Number.isFinite(c) && c > 0)
    );
  });
}

export function mergeRecipeIngredientDefaults(
  recipe: RecipeForm,
  names: readonly string[],
): RecipeForm {
  if (!needsDefaultIngredientRows(recipe.ingredients)) return recipe;
  return { ...recipe, ingredients: ingredientRowsFromNames(names) };
}

export function laborRowsFromLabels(labels: readonly string[]): LaborRow[] {
  return labels.map((label) => ({
    id: rowId(),
    label,
    hours: "",
    hourlyRate: "",
  }));
}

export function needsDefaultLaborRows(rows: LaborRow[]): boolean {
  if (!rows.length) return true;
  return !rows.some((row) => {
    if (row.label?.trim()) return true;
    const h = Number.parseFloat(row.hours);
    const r = Number.parseFloat(row.hourlyRate);
    return (
      (Number.isFinite(h) && h > 0) ||
      (Number.isFinite(r) && r > 0)
    );
  });
}

export function mergeRecipeLaborDefaults(
  recipe: RecipeForm,
  labels: readonly string[],
): RecipeForm {
  if (!needsDefaultLaborRows(recipe.laborPhases)) return recipe;
  return { ...recipe, laborPhases: laborRowsFromLabels(labels) };
}

export function mergeRecipeDefaults(
  recipe: RecipeForm,
  options: {
    ingredientNames: readonly string[];
    laborLabels: readonly string[];
  },
): RecipeForm {
  return mergeRecipeLaborDefaults(
    mergeRecipeIngredientDefaults(recipe, options.ingredientNames),
    options.laborLabels,
  );
}

export const DEFAULT_RECIPE: RecipeForm = {
  name: "",
  ingredients: ingredientRowsFromNames([
    "Farine",
    "Sucre",
    "Beurre",
    "Œufs",
    "Lait",
    "Poudre à lever",
    "Crème",
    "Chocolat",
    "Sel",
    "Vanille",
  ]),
  laborPhases: laborRowsFromLabels([
    "Préparation",
    "Cuisson",
    "Décoration",
    "Conditionnement",
  ]),
  wastePercent: "3",
  marginPercent: "40",
};

export function normalizeRecipeForm(raw: Partial<RecipeForm>): RecipeForm {
  return {
    ...DEFAULT_RECIPE,
    ...raw,
    ingredients: raw.ingredients?.length
      ? raw.ingredients
      : DEFAULT_RECIPE.ingredients,
    laborPhases: raw.laborPhases?.length
      ? raw.laborPhases
      : DEFAULT_RECIPE.laborPhases,
  };
}

export function emptyIngredientRow(): IngredientRow {
  return {
    id: rowId(),
    name: "",
    quantity: "",
    quantityUnit: "kg",
    costPerUnit: "",
  };
}

export function normalizeIngredientRow(row: IngredientRow): IngredientRow {
  const unit =
    row.quantityUnit && isIngredientQuantityUnit(row.quantityUnit)
      ? row.quantityUnit
      : "kg";
  return { ...row, name: row.name ?? "", quantityUnit: unit };
}

export function parsedLinesToRows(
  lines: {
    name: string;
    quantity: string;
    quantityUnit: IngredientQuantityUnit;
    costPerUnit: string;
  }[],
): IngredientRow[] {
  return lines.map((line) => ({
    id: rowId(),
    name: line.name,
    quantity: line.quantity,
    quantityUnit: line.quantityUnit,
    costPerUnit: line.costPerUnit,
  }));
}

export function emptyLaborRow(): LaborRow {
  return { id: rowId(), label: "", hours: "", hourlyRate: "" };
}

export function parseIngredients(
  rows: IngredientRow[],
  entryCurrency: DisplayCurrency = "MAD",
): IngredientLine[] | null {
  const lines: IngredientLine[] = [];
  for (const row of rows) {
    const q = parseNonNegative(row.quantity);
    const c = parseNonNegativeInMad(row.costPerUnit, entryCurrency);
    if (q === null && c === null) continue;
    if (q === null || c === null || (q === 0 && c === 0)) return null;
    lines.push({ quantity: q, costPerUnit: c });
  }
  return lines.length > 0 ? lines : null;
}

export function parseLaborPhases(
  rows: LaborRow[],
  entryCurrency: DisplayCurrency = "MAD",
): LaborPhase[] | null {
  const phases: LaborPhase[] = [];
  for (const row of rows) {
    const hours = parseNonNegative(row.hours);
    const rate = parseNonNegativeInMad(row.hourlyRate, entryCurrency);
    if (hours === null && rate === null) continue;
    if (hours === null || rate === null || hours === 0) return null;
    phases.push({ hours, hourlyRate: rate });
  }
  return phases.length > 0 ? phases : null;
}

function parseNonNegative(value: string): number | null {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function recipeLaborHours(phases: LaborPhase[]): number {
  return phases.reduce((sum, p) => sum + p.hours, 0);
}
