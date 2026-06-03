import type { IngredientQuantityUnit } from "@/lib/ingredient-units";
import type { IngredientRow } from "@/lib/recipe";

const CATALOG_KEY = "gramwise-ingredient-catalog-v2";
const LEGACY_CATALOG_KEY = "gramwise-ingredient-catalog-v1";

export type CatalogIngredient = {
  id: string;
  name: string;
  quantityUnit: IngredientQuantityUnit;
  costPerUnit: string;
};

/** ~50 common pastry ingredients (MAD purchase price hints — user can edit). */
export const DEFAULT_INGREDIENT_CATALOG: CatalogIngredient[] = [
  { id: "farine", name: "Farine", quantityUnit: "kg", costPerUnit: "6.5" },
  { id: "farine-t55", name: "Farine T55", quantityUnit: "kg", costPerUnit: "7" },
  { id: "sucre-semoule", name: "Sucre semoule", quantityUnit: "kg", costPerUnit: "8" },
  { id: "sucre-glace", name: "Sucre glace", quantityUnit: "kg", costPerUnit: "9" },
  { id: "sucre-roux", name: "Sucre roux", quantityUnit: "kg", costPerUnit: "9.5" },
  { id: "cassonade", name: "Cassonade", quantityUnit: "kg", costPerUnit: "10" },
  { id: "beurre-doux", name: "Beurre doux", quantityUnit: "kg", costPerUnit: "95" },
  { id: "beurre-demi-sel", name: "Beurre demi-sel", quantityUnit: "kg", costPerUnit: "98" },
  { id: "oeufs", name: "Œufs", quantityUnit: "unit", costPerUnit: "2.5" },
  { id: "lait", name: "Lait", quantityUnit: "L", costPerUnit: "8" },
  { id: "creme-liquide", name: "Crème liquide", quantityUnit: "L", costPerUnit: "28" },
  { id: "creme-fleurette", name: "Crème fleurette", quantityUnit: "L", costPerUnit: "25" },
  { id: "creme-fraiche", name: "Crème fraîche", quantityUnit: "L", costPerUnit: "32" },
  { id: "mascarpone", name: "Mascarpone", quantityUnit: "kg", costPerUnit: "85" },
  { id: "fromage-creme", name: "Fromage à la crème", quantityUnit: "kg", costPerUnit: "70" },
  { id: "ricotta", name: "Ricotta", quantityUnit: "kg", costPerUnit: "65" },
  { id: "cacao-poudre", name: "Cacao en poudre", quantityUnit: "kg", costPerUnit: "95" },
  { id: "beurre-cacao", name: "Beurre de cacao", quantityUnit: "kg", costPerUnit: "140" },
  { id: "chocolat-noir-70", name: "Chocolat noir 70%", quantityUnit: "kg", costPerUnit: "130" },
  { id: "chocolat-noir-55", name: "Chocolat noir 55%", quantityUnit: "kg", costPerUnit: "115" },
  { id: "chocolat-lait", name: "Chocolat au lait", quantityUnit: "kg", costPerUnit: "110" },
  { id: "chocolat-blanc", name: "Chocolat blanc", quantityUnit: "kg", costPerUnit: "105" },
  { id: "chocolat-blond", name: "Chocolat blond", quantityUnit: "kg", costPerUnit: "125" },
  { id: "couverture-noir", name: "Couverture chocolat noir", quantityUnit: "kg", costPerUnit: "145" },
  { id: "couverture-lait", name: "Couverture chocolat lait", quantityUnit: "kg", costPerUnit: "135" },
  { id: "pepites-noir", name: "Pépites chocolat noir", quantityUnit: "kg", costPerUnit: "125" },
  { id: "pepites-lait", name: "Pépites chocolat au lait", quantityUnit: "kg", costPerUnit: "118" },
  { id: "pate-tartiner", name: "Pâte noisettes-chocolat", quantityUnit: "kg", costPerUnit: "90" },
  { id: "praline-noisettes", name: "Praliné noisettes", quantityUnit: "kg", costPerUnit: "160" },
  { id: "pate-amande", name: "Pâte d'amande", quantityUnit: "kg", costPerUnit: "150" },
  { id: "amandes-poudre", name: "Amandes en poudre", quantityUnit: "kg", costPerUnit: "180" },
  { id: "amandes-effilees", name: "Amandes effilées", quantityUnit: "kg", costPerUnit: "190" },
  { id: "noisettes", name: "Noisettes", quantityUnit: "kg", costPerUnit: "200" },
  { id: "pistaches", name: "Pistaches", quantityUnit: "kg", costPerUnit: "280" },
  { id: "noix", name: "Noix", quantityUnit: "kg", costPerUnit: "220" },
  { id: "noix-coco", name: "Noix de coco râpée", quantityUnit: "kg", costPerUnit: "75" },
  { id: "glucose", name: "Glucose", quantityUnit: "kg", costPerUnit: "25" },
  { id: "miel", name: "Miel", quantityUnit: "kg", costPerUnit: "90" },
  { id: "trimoline", name: "Trimoline", quantityUnit: "kg", costPerUnit: "35" },
  { id: "poudre-lait", name: "Poudre de lait", quantityUnit: "kg", costPerUnit: "55" },
  { id: "lait-concentre", name: "Lait concentré sucré", quantityUnit: "kg", costPerUnit: "45" },
  { id: "poudre-lever", name: "Poudre à lever", quantityUnit: "kg", costPerUnit: "45" },
  { id: "levure-seche", name: "Levure boulangère sèche", quantityUnit: "kg", costPerUnit: "35" },
  { id: "bicarbonate", name: "Bicarbonate de soude", quantityUnit: "kg", costPerUnit: "18" },
  { id: "gelatine", name: "Gélatine", quantityUnit: "kg", costPerUnit: "350" },
  { id: "agar-agar", name: "Agar-agar", quantityUnit: "kg", costPerUnit: "420" },
  { id: "pectine", name: "Pectine", quantityUnit: "kg", costPerUnit: "380" },
  { id: "maizena", name: "Maïzena", quantityUnit: "kg", costPerUnit: "22" },
  { id: "fleur-sel", name: "Fleur de sel", quantityUnit: "kg", costPerUnit: "80" },
  { id: "sel", name: "Sel fin", quantityUnit: "kg", costPerUnit: "4" },
  { id: "vanille-extrait", name: "Extrait de vanille", quantityUnit: "L", costPerUnit: "450" },
  { id: "vanille-gousse", name: "Gousse de vanille", quantityUnit: "unit", costPerUnit: "35" },
  { id: "huile-neutre", name: "Huile neutre", quantityUnit: "L", costPerUnit: "35" },
  { id: "puree-framboise", name: "Purée de framboise", quantityUnit: "kg", costPerUnit: "95" },
  { id: "puree-passion", name: "Purée fruits de la passion", quantityUnit: "kg", costPerUnit: "110" },
  { id: "eau-fleur-oranger", name: "Eau de fleur d'oranger", quantityUnit: "L", costPerUnit: "120" },
  { id: "citron", name: "Citron", quantityUnit: "unit", costPerUnit: "3" },
  { id: "fruits-confits", name: "Fruits confits", quantityUnit: "kg", costPerUnit: "85" },
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

function mergeCatalogWithDefaults(
  saved: CatalogIngredient[],
): CatalogIngredient[] {
  const keys = new Set(saved.map((item) => catalogKey(item.name)));
  const merged = saved.map((item) => ({ ...item }));
  for (const def of DEFAULT_INGREDIENT_CATALOG) {
    if (keys.has(catalogKey(def.name))) continue;
    merged.push({ ...def });
    keys.add(catalogKey(def.name));
  }
  return merged;
}

function readStoredCatalog(raw: string): CatalogIngredient[] | null {
  try {
    const parsed = JSON.parse(raw) as CatalogIngredient[];
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function loadIngredientCatalog(): CatalogIngredient[] {
  if (typeof window === "undefined") return DEFAULT_INGREDIENT_CATALOG;

  try {
    const current = localStorage.getItem(CATALOG_KEY);
    if (current) {
      const saved = readStoredCatalog(current);
      if (saved) {
        const merged = mergeCatalogWithDefaults(saved);
        if (merged.length !== saved.length) {
          persistCatalog(merged);
        }
        return merged;
      }
    }

    const legacy = localStorage.getItem(LEGACY_CATALOG_KEY);
    if (legacy) {
      const saved = readStoredCatalog(legacy);
      const merged = mergeCatalogWithDefaults(saved ?? []);
      persistCatalog(merged);
      return merged;
    }

    persistCatalog(DEFAULT_INGREDIENT_CATALOG);
    return structuredClone(DEFAULT_INGREDIENT_CATALOG);
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
