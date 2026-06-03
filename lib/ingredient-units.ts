/** Quantity unit for one ingredient row in the recipe. */
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

export type UnitFamily = "mass" | "volume" | "count";

export function unitFamily(unit: IngredientQuantityUnit): UnitFamily {
  if (unit === "kg" || unit === "g") return "mass";
  if (unit === "L" || unit === "ml") return "volume";
  return "count";
}

/** Catalog prices are usually per kg, L, or piece while recipes use g or ml. */
export function defaultPriceUnit(
  quantityUnit: IngredientQuantityUnit,
): IngredientQuantityUnit {
  switch (quantityUnit) {
    case "g":
      return "kg";
    case "ml":
      return "L";
    default:
      return quantityUnit;
  }
}

export function resolvePriceUnit(
  quantityUnit: IngredientQuantityUnit,
  explicit?: IngredientQuantityUnit,
): IngredientQuantityUnit {
  if (
    explicit &&
    isIngredientQuantityUnit(explicit) &&
    unitFamily(explicit) === unitFamily(quantityUnit)
  ) {
    return explicit;
  }
  return defaultPriceUnit(quantityUnit);
}

/** Express `quantity` in `toUnit` (same family only). */
export function convertQuantity(
  quantity: number,
  from: IngredientQuantityUnit,
  to: IngredientQuantityUnit,
): number | null {
  if (from === to) return quantity;
  if (unitFamily(from) !== unitFamily(to)) return null;
  if (from === "g" && to === "kg") return quantity / 1000;
  if (from === "kg" && to === "g") return quantity * 1000;
  if (from === "ml" && to === "L") return quantity / 1000;
  if (from === "L" && to === "ml") return quantity * 1000;
  return null;
}
