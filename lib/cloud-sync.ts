import type { CatalogIngredient } from "@/lib/ingredient-catalog";
import type { SavedRecipe } from "@/lib/recipe-library";
import { attachOwnerToRecipes, replaceOwnerRecipeLibrary } from "@/lib/recipe-library";
import { saveIngredientCatalog } from "@/lib/ingredient-catalog";
import type { WizardSession } from "@/lib/session";
import { loadWizardSession, saveWizardSession } from "@/lib/session";
import { loadIngredientCatalog } from "@/lib/ingredient-catalog";
import { loadRecipeLibrary } from "@/lib/recipe-library";
import { getRecipeOwnerId } from "@/lib/recipe-owner";

export const CLOUD_SNAPSHOT_VERSION = 1 as const;

export type CloudSnapshotV1 = {
  version: typeof CLOUD_SNAPSHOT_VERSION;
  updatedAt: string;
  wizard: WizardSession | null;
  recipes: SavedRecipe[];
  catalog: CatalogIngredient[] | null;
};

export function buildLocalSnapshot(): CloudSnapshotV1 {
  const ownerId = getRecipeOwnerId();
  return {
    version: CLOUD_SNAPSHOT_VERSION,
    updatedAt: new Date().toISOString(),
    wizard: loadWizardSession(),
    recipes: attachOwnerToRecipes(loadRecipeLibrary(), ownerId),
    catalog: loadIngredientCatalog(),
  };
}

export function applyLocalSnapshot(snapshot: CloudSnapshotV1): void {
  if (snapshot.wizard) {
    saveWizardSession(snapshot.wizard);
  }
  replaceOwnerRecipeLibrary(snapshot.recipes);
  if (snapshot.catalog?.length) {
    saveIngredientCatalog(snapshot.catalog);
  }
}

export function mergeSnapshots(
  local: CloudSnapshotV1,
  remote: CloudSnapshotV1,
): CloudSnapshotV1 {
  const recipeMap = new Map<string, SavedRecipe>();
  for (const recipe of remote.recipes) {
    recipeMap.set(recipe.id, recipe);
  }
  for (const recipe of local.recipes) {
    const existing = recipeMap.get(recipe.id);
    if (
      !existing ||
      Date.parse(recipe.savedAt) >= Date.parse(existing.savedAt)
    ) {
      recipeMap.set(recipe.id, recipe);
    }
  }

  const localTs = Date.parse(local.updatedAt);
  const remoteTs = Date.parse(remote.updatedAt);
  const wizard =
    localTs >= remoteTs ? local.wizard : remote.wizard ?? local.wizard;

  let catalog: CatalogIngredient[] | null = null;
  if (local.catalog && remote.catalog) {
    catalog = localTs >= remoteTs ? local.catalog : remote.catalog;
  } else {
    catalog = local.catalog ?? remote.catalog;
  }

  return {
    version: CLOUD_SNAPSHOT_VERSION,
    updatedAt: new Date().toISOString(),
    wizard,
    recipes: [...recipeMap.values()].sort(
      (a, b) => Date.parse(b.savedAt) - Date.parse(a.savedAt),
    ),
    catalog,
  };
}

export function parseCloudSnapshot(raw: unknown): CloudSnapshotV1 | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<CloudSnapshotV1>;
  if (o.version !== CLOUD_SNAPSHOT_VERSION) return null;
  if (typeof o.updatedAt !== "string") return null;
  if (!Array.isArray(o.recipes)) return null;
  return {
    version: CLOUD_SNAPSHOT_VERSION,
    updatedAt: o.updatedAt,
    wizard: o.wizard ?? null,
    recipes: o.recipes,
    catalog: o.catalog ?? null,
  };
}
