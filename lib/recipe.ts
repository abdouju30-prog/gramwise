import type { IngredientLine, LaborPhase } from "@/engine/types";

export type IngredientRow = {
  id: string;
  name: string;
  quantity: string;
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
    { id: "1", name: "Flour", quantity: "0.8", costPerUnit: "0.45" },
    { id: "2", name: "Sugar", quantity: "0.6", costPerUnit: "0.65" },
    { id: "3", name: "Butter", quantity: "0.5", costPerUnit: "6.2" },
    { id: "4", name: "Eggs", quantity: "6", costPerUnit: "0.28" },
    { id: "5", name: "Milk", quantity: "0.4", costPerUnit: "0.9" },
    { id: "6", name: "Vanilla", quantity: "0.05", costPerUnit: "3.0" },
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
    costPerUnit: "",
  }));
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
  laborPhases: [{ id: rowId(), label: "", hours: "", hourlyRate: "" }],
  wastePercent: "3",
  marginPercent: "40",
};

export function emptyIngredientRow(): IngredientRow {
  return { id: rowId(), name: "", quantity: "", costPerUnit: "" };
}

export function emptyLaborRow(): LaborRow {
  return { id: rowId(), label: "", hours: "", hourlyRate: "" };
}

export function parseIngredients(rows: IngredientRow[]): IngredientLine[] | null {
  const lines: IngredientLine[] = [];
  for (const row of rows) {
    const q = parseNonNegative(row.quantity);
    const c = parseNonNegative(row.costPerUnit);
    if (q === null && c === null) continue;
    if (q === null || c === null || (q === 0 && c === 0)) return null;
    lines.push({ quantity: q, costPerUnit: c });
  }
  return lines.length > 0 ? lines : null;
}

export function parseLaborPhases(rows: LaborRow[]): LaborPhase[] | null {
  const phases: LaborPhase[] = [];
  for (const row of rows) {
    const hours = parseNonNegative(row.hours);
    const rate = parseNonNegative(row.hourlyRate);
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
