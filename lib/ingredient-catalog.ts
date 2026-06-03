import type { IngredientQuantityUnit } from "@/lib/ingredient-units";
import type { IngredientRow } from "@/lib/recipe";

const CATALOG_KEY = "gramwise-ingredient-catalog-v1";

export type CatalogIngredient = {
  id: string;
  name: string;
  quantityUnit: IngredientQuantityUnit;
  costPerUnit: string;
};

export const DEFAULT_INGREDIENT_CATALOG: CatalogIngredient[] = [
  { id: "farine", name: "Farine", quantityUnit: "kg", costPerUnit: "6.5" },
  { id: "sucre-semoule", name: "Sucre semoule", quantityUnit: "kg", costPerUnit: "8" },
  { id: "sucre-glace", name: "Sucre glace", quantityUnit: "kg", costPerUnit: "9" },
  { id: "beurre-doux", name: "Beurre doux", quantityUnit: "kg", costPerUnit: "95" },
  { id: "oeufs", name: "Œufs", quantityUnit: "unit", costPerUnit: "2.5" },
  { id: "lait", name: "Lait", quantityUnit: "L", costPerUnit: "8" },
  { id: "creme", name: "Crème", quantityUnit: "L", costPerUnit: "28" },
  { id: "creme-fleurette", name: "Crème fleurette", quantityUnit: "L", costPerUnit: "25" },
  { id: "glucose", name: "Glucose", quantityUnit: "kg", costPerUnit: "25" },
  { id: "fleur-sel", name: "Fleur de sel", quantityUnit: "kg", costPerUnit: "80" },
  { id: "chocolat-noir", name: "Chocolat noir", quantityUnit: "kg", costPerUnit: "120" },
  { id: "chocolat-lait", name: "Chocolat au lait", quantityUnit: "kg", costPerUnit: "110" },
  { id: "poudre-lever", name: "Poudre à lever", quantityUnit: "kg", costPerUnit: "45" },
  { id: "levure", name: "Levure boulangère", quantityUnit: "kg", costPerUnit: "35" },
  { id: "sel", name: "Sel", quantityUnit: "kg", costPerUnit: "4" },
  { id: "vanille", name: "Extrait de vanille", quantityUnit: "L", costPerUnit: "450" },
  { id: "miel", name: "Miel", quantityUnit: "kg", costPerUnit: "90" },
  { id: "amandes", name: "Amandes en poudre", quantityUnit: "kg", costPerUnit: "180" },
  { id: "noisettes", name: "Noisettes", quantityUnit: "kg", costPerUnit: "200" },
  { id: "huile", name: "Huile", quantityUnit: "L", costPerUnit: "35" },
  { id: "mascarpone", name: "Mascarpone", quantityUnit: "kg", costPerUnit: "85" },
  { id: "fromage-creme", name: "Fromage à la crème", quantityUnit: "kg", costPerUnit: "70" },
  { id: "gelatine", name: "Gélatine", quantityUnit: "kg", costPerUnit: "350" },
  { id: "cacao", name: "Cacao en poudre", quantityUnit: "kg", costPerUnit: "95" },
];

function rowId(): string {
  return crypto.randomUUID();
}

export function catalogKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ");
}

export function loadIngredientCatalog(): CatalogIngredient[] {
  if (typeof window === "undefined") return DEFAULT_INGREDIENT_CATALOG;
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (!raw) {
      persistCatalog(DEFAULT_INGREDIENT_CATALOG);
      return structuredClone(DEFAULT_INGREDIENT_CATALOG);
    }
    const parsed = JSON.parse(raw) as CatalogIngredient[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_INGREDIENT_CATALOG;
  } catch {
    return structuredClone(DEFAULT_INGREDIENT_CATALOG);
  }
}

function persistCatalog(entries: CatalogIngredient[]): void {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(entries));
}

export function saveIngredientCatalog(entries: CatalogIngredient[]): void {
  persistCatalog(entries.slice(0, 200));
}

export function createCatalogIngredient(): CatalogIngredient {
  return {
    id: rowId(),
    name: "",
    quantityUnit: "kg",
    costPerUnit: "",
  };
}

export function findCatalogMatch(
  name: string,
  catalog: CatalogIngredient[],
): CatalogIngredient | null {
  const key = catalogKey(name);
  if (!key) return null;
  return (
    catalog.find((item) => catalogKey(item.name) === key) ??
    catalog.find(
      (item) =>
        catalogKey(item.name).includes(key) || key.includes(catalogKey(item.name)),
    ) ??
    null
  );
}

function costIsEmpty(value: string): boolean {
  const n = Number.parseFloat(value);
  return !value.trim() || !Number.isFinite(n) || n === 0;
}

export function applyCatalogToRow(
  row: IngredientRow,
  catalog: CatalogIngredient[],
  options?: { force?: boolean },
): IngredientRow {
  const match = findCatalogMatch(row.name ?? "", catalog);
  if (!match) return row;
  const force = options?.force ?? false;
  return {
    ...row,
    quantityUnit: force || !row.quantityUnit ? match.quantityUnit : row.quantityUnit,
    costPerUnit:
      force || costIsEmpty(row.costPerUnit) ? match.costPerUnit : row.costPerUnit,
  };
}

export function applyCatalogToRows(
  rows: IngredientRow[],
  catalog: CatalogIngredient[],
): IngredientRow[] {
  return rows.map((row) => applyCatalogToRow(row, catalog));
}
