import {
  emptyIngredientRow,
  emptyLaborRow,
  type RecipeForm,
} from "@/lib/recipe";

const LIBRARY_KEY = "gramwise-recipe-library-v1";

export type SavedRecipe = {
  id: string;
  name: string;
  savedAt: string;
  recipe: RecipeForm;
};

function rowId(): string {
  return crypto.randomUUID();
}

export function freshRecipeForm(): RecipeForm {
  return {
    name: "",
    ingredients: [
      emptyIngredientRow(),
      emptyIngredientRow(),
      emptyIngredientRow(),
    ],
    laborPhases: [emptyLaborRow()],
    wastePercent: "3",
    marginPercent: "40",
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

export function loadRecipeLibrary(): SavedRecipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRecipe[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistLibrary(entries: SavedRecipe[]): void {
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(entries));
}

export function saveRecipeToLibrary(recipe: RecipeForm): SavedRecipe {
  const entry: SavedRecipe = {
    id: rowId(),
    name: recipe.name.trim() || `Recette ${new Date().toLocaleDateString()}`,
    savedAt: new Date().toISOString(),
    recipe: structuredClone(recipe),
  };
  const library = loadRecipeLibrary();
  library.unshift(entry);
  persistLibrary(library.slice(0, 50));
  return entry;
}

export function deleteSavedRecipe(id: string): void {
  persistLibrary(loadRecipeLibrary().filter((e) => e.id !== id));
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
  const parsed = JSON.parse(json) as unknown;
  if (!Array.isArray(parsed)) throw new Error("INVALID_FORMAT");
  const incoming = parsed.filter(
    (e): e is SavedRecipe =>
      typeof e === "object" &&
      e !== null &&
      "id" in e &&
      "recipe" in e &&
      typeof (e as SavedRecipe).recipe === "object",
  );
  const byId = new Map(loadRecipeLibrary().map((e) => [e.id, e]));
  for (const entry of incoming) {
    byId.set(entry.id, entry);
  }
  const merged = [...byId.values()].sort(
    (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
  );
  persistLibrary(merged.slice(0, 100));
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
