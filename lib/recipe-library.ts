import {
  DEFAULT_RECIPE_CAPACITY,
  emptyIngredientRow,
  emptyLaborRow,
  laborRowsFromLabels,
  type RecipeForm,
} from "@/lib/recipe";
import { getRecipeOwnerId } from "@/lib/recipe-owner";
import { emitDataChanged } from "@/lib/data-events";

const LIBRARY_KEY = "gramwise-recipe-library-v2";
const LEGACY_LIBRARY_KEY = "gramwise-recipe-library-v1";
const MAX_SAVED_RECIPES_PER_OWNER = 200;
const MAX_TOTAL_STORED = 2000;

export type SavedRecipe = {
  id: string;
  /** Owner on this device — only they can read, update, or delete. */
  ownerId: string;
  name: string;
  savedAt: string;
  recipe: RecipeForm;
};

function rowId(): string {
  return crypto.randomUUID();
}

export function freshRecipeForm(laborLabels?: readonly string[]): RecipeForm {
  return {
    name: "",
    ingredients: [
      emptyIngredientRow(),
      emptyIngredientRow(),
      emptyIngredientRow(),
    ],
    laborPhases: laborLabels?.length
      ? laborRowsFromLabels(laborLabels)
      : [emptyLaborRow()],
    wastePercent: "3",
    marginPercent: "40",
    laborByOwner: false,
    ...DEFAULT_RECIPE_CAPACITY,
  };
}

export function recipeHasSaveableContent(form: RecipeForm): boolean {
  if (form.name.trim().length > 0) return true;
  return form.ingredients.some((row) => {
    if (!row.name?.trim()) return false;
    const q = Number.parseFloat(row.quantity);
    const c = Number.parseFloat(row.costPerUnit);
    return (
      (Number.isFinite(q) && q > 0) ||
      (Number.isFinite(c) && c > 0)
    );
  });
}

function belongsToOwner(entry: SavedRecipe, ownerId: string): boolean {
  return !entry.ownerId || entry.ownerId === ownerId;
}

function attachOwner(entry: SavedRecipe, ownerId: string): SavedRecipe {
  return { ...entry, ownerId: entry.ownerId ?? ownerId };
}

function readRawLibrary(key: string): SavedRecipe[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedRecipe[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** All recipes in storage (every owner on this browser). */
function readAllLibrary(): SavedRecipe[] {
  const current = readRawLibrary(LIBRARY_KEY);
  if (current) return current;

  const legacy = readRawLibrary(LEGACY_LIBRARY_KEY);
  if (legacy) {
    writeAllLibrary(legacy);
    return legacy;
  }

  return [];
}

function writeAllLibrary(entries: SavedRecipe[]): void {
  localStorage.setItem(
    LIBRARY_KEY,
    JSON.stringify(entries.slice(0, MAX_TOTAL_STORED)),
  );
}

/** Keep other owners' recipes; replace only this owner's slice. */
function persistOwnerRecipes(ownerRecipes: SavedRecipe[]): void {
  const ownerId = getRecipeOwnerId();
  const all = readAllLibrary();
  const others = all.filter(
    (e) => e.ownerId && e.ownerId !== ownerId,
  );
  const trimmed = ownerRecipes.slice(0, MAX_SAVED_RECIPES_PER_OWNER);
  writeAllLibrary([...trimmed, ...others]);
  emitDataChanged();
}

export function attachOwnerToRecipes(
  recipes: SavedRecipe[],
  ownerId: string,
): SavedRecipe[] {
  return recipes.map((entry) => attachOwner(entry, ownerId));
}

export function replaceOwnerRecipeLibrary(recipes: SavedRecipe[]): void {
  const ownerId = getRecipeOwnerId();
  persistOwnerRecipes(attachOwnerToRecipes(recipes, ownerId));
}

function recipesForOwner(all: SavedRecipe[], ownerId: string): SavedRecipe[] {
  return all
    .filter((e) => belongsToOwner(e, ownerId))
    .map((e) => attachOwner(e, ownerId))
    .sort((a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt));
}

/** Claim legacy rows without ownerId for this browser profile (once). */
function claimUnownedRecipes(all: SavedRecipe[], ownerId: string): SavedRecipe[] {
  let changed = false;
  const next = all.map((entry) => {
    if (entry.ownerId) return entry;
    changed = true;
    return attachOwner(entry, ownerId);
  });
  if (changed) writeAllLibrary(next);
  return next;
}

export function loadRecipeLibrary(): SavedRecipe[] {
  if (typeof window === "undefined") return [];

  const ownerId = getRecipeOwnerId();

  try {
    let all = readAllLibrary();
    all = claimUnownedRecipes(all, ownerId);
    return recipesForOwner(all, ownerId);
  } catch {
    return [];
  }
}

export function saveRecipeToLibrary(recipe: RecipeForm): SavedRecipe {
  const ownerId = getRecipeOwnerId();
  const entry: SavedRecipe = {
    id: rowId(),
    ownerId,
    name: recipe.name.trim() || `Recette ${new Date().toLocaleDateString()}`,
    savedAt: new Date().toISOString(),
    recipe: structuredClone(recipe),
  };
  const library = loadRecipeLibrary();
  library.unshift(entry);
  persistOwnerRecipes(library);
  return entry;
}

export function updateSavedRecipe(
  id: string,
  recipe: RecipeForm,
): SavedRecipe | null {
  const ownerId = getRecipeOwnerId();
  const library = loadRecipeLibrary();
  const index = library.findIndex((e) => e.id === id);
  if (index === -1) return null;
  if (library[index].ownerId !== ownerId) return null;

  const entry: SavedRecipe = {
    ...library[index],
    ownerId,
    name: recipe.name.trim() || library[index].name,
    savedAt: new Date().toISOString(),
    recipe: structuredClone(recipe),
  };
  library[index] = entry;
  persistOwnerRecipes(library);
  return entry;
}

/** Returns false if the recipe is missing or not owned by this user. */
export function deleteSavedRecipe(id: string): boolean {
  const ownerId = getRecipeOwnerId();
  const library = loadRecipeLibrary();
  const target = library.find((e) => e.id === id);
  if (!target || target.ownerId !== ownerId) return false;
  persistOwnerRecipes(library.filter((e) => e.id !== id));
  return true;
}

export function downloadRecipeLibraryJson(
  library: SavedRecipe[] = loadRecipeLibrary(),
): void {
  const blob = new Blob([JSON.stringify(library, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gramwise-recipes-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function mergeImportedLibrary(json: string): number {
  const ownerId = getRecipeOwnerId();
  const parsed = JSON.parse(json) as unknown;
  if (!Array.isArray(parsed)) throw new Error("INVALID_FORMAT");
  const incoming = parsed.filter(
    (e): e is SavedRecipe =>
      typeof e === "object" &&
      e !== null &&
      "id" in e &&
      "recipe" in e &&
      typeof (e as SavedRecipe).recipe === "object" &&
      belongsToOwner(e as SavedRecipe, ownerId),
  );
  const byId = new Map(loadRecipeLibrary().map((e) => [e.id, e]));
  for (const entry of incoming) {
    byId.set(entry.id, attachOwner(entry, ownerId));
  }
  const merged = [...byId.values()].sort(
    (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
  );
  persistOwnerRecipes(merged);
  return incoming.length;
}

/** Write library JSON to a user-chosen file (Chrome/Edge). Falls back to download. */
export async function saveLibraryToUserFile(): Promise<"picker" | "download"> {
  const library = loadRecipeLibrary();
  const payload = JSON.stringify(library, null, 2);
  const suggestedName = `gramwise-recipes-${new Date().toISOString().slice(0, 10)}.json`;

  const picker = (
    window as Window & {
      showSaveFilePicker?: (options?: {
        suggestedName?: string;
        types?: { description: string; accept: Record<string, string[]> }[];
      }) => Promise<FileSystemFileHandle>;
    }
  ).showSaveFilePicker;

  if (picker) {
    const handle = await picker({
      suggestedName,
      types: [
        {
          description: "GramWise recipes",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(payload);
    await writable.close();
    return "picker";
  }

  downloadRecipeLibraryJson(library);
  return "download";
}
