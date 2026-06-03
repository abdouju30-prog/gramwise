/** Quantity unit for one ingredient row (must match cost-per-unit basis). */
export type IngredientQuantityUnit = "kg" | "g" | "L" | "ml" | "unit";

export const INGREDIENT_QUANTITY_UNITS: readonly IngredientQuantityUnit[] = [
  "kg",
  "g",
  "L",
  "ml",
  "unit",
] as const;

const UNIT_ALIASES: Record<string, IngredientQuantityUnit> = {
  kg: "kg",
  kgs: "kg",
  kilo: "kg",
  kilos: "kg",
  kilogram: "kg",
  kilogramme: "kg",
  kilogrammes: "kg",
  g: "g",
  gr: "g",
  gram: "g",
  gramme: "g",
  grammes: "g",
  l: "L",
  litre: "L",
  liter: "L",
  litres: "L",
  liters: "L",
  ml: "ml",
  mL: "ml",
  millilitre: "ml",
  millilitres: "ml",
  u: "unit",
  unit: "unit",
  units: "unit",
  piece: "unit",
  pieces: "unit",
  pc: "unit",
  pcs: "unit",
  pièce: "unit",
  pièces: "unit",
  oeuf: "unit",
  oeufs: "unit",
  œuf: "unit",
  œufs: "unit",
};

export function normalizeIngredientUnit(
  raw: string | undefined,
): IngredientQuantityUnit | null {
  if (!raw?.trim()) return null;
  const key = raw.trim().toLowerCase();
  return UNIT_ALIASES[key] ?? UNIT_ALIASES[raw.trim()] ?? null;
}

export function isIngredientQuantityUnit(
  value: string,
): value is IngredientQuantityUnit {
  return (INGREDIENT_QUANTITY_UNITS as readonly string[]).includes(value);
}
