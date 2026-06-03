import {
  DEFAULT_RECIPE_CAPACITY,
  emptyIngredientRow,
  emptyLaborRow,
  laborRowsFromLabels,
  type RecipeForm,
} from "@/lib/recipe";
import { getRecipeOwnerId } from "@/lib/recipe-owner";

const LIBRARY_KEY = "gramwise-recipe-library-v2";
const LEGACY_LIBRARY_KEY = "gramwise-recipe-library-v1";
const MAX_SAVED_RECIPES = 200;

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

function migrateAndFilter(entries: SavedRecipe[], ownerId: string): SavedRecipe[] {
  const owned = entries
    .filter((e) => belongsToOwner(e, ownerId))
    .map((e) => attachOwner(e, ownerId));
  return owned.sort(
    (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
  );
}

function persistLibrary(entries: SavedRecipe[]): void {
  localStorage.setItem(
    LIBRARY_KEY,
    JSON.stringify(entries.slice(0, MAX_SAVED_RECIPES)),
  );
}

export function loadRecipeLibrary(): SavedRecipe[] {
  if (typeof window === "undefined") return [];

  const ownerId = getRecipeOwnerId();

  try {
    const current = readRawLibrary(LIBRARY_KEY);
    if (current) {
      const library = migrateAndFilter(current, ownerId);
      if (
        library.length !== current.length ||
        current.some((e) => !e.ownerId)
      ) {
        persistLibrary(library);
      }
      return library;
    }

    const legacy = readRawLibrary(LEGACY_LIBRARY_KEY);
    if (legacy) {
      const library = migrateAndFilter(legacy, ownerId);
      persistLibrary(library);
      return library;
    }

    return [];
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
  persistLibrary(library);
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
  persistLibrary(library);
  return entry;
}

/** Returns false if the recipe is missing or not owned by this user. */
export function deleteSavedRecipe(id: string): boolean {
  const ownerId = getRecipeOwnerId();
  const library = loadRecipeLibrary();
  const target = library.find((e) => e.id === id);
  if (!target || target.ownerId !== ownerId) return false;
  persistLibrary(library.filter((e) => e.id !== id));
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
  persistLibrary(merged);
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
