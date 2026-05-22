import type { FixedChargesForm } from "@/lib/fixed-charges";
import type { RecipeForm } from "@/lib/recipe";

const STORAGE_KEY_V2 = "gramwise-wizard-v2";
const STORAGE_KEY_V1 = "gramwise-wizard-v1";

/** Bump when default ingredient rows must be re-applied for existing sessions. */
export const RECIPE_DEFAULTS_GENERATION = 2;

export type WizardSession = {
  fixedCharges: FixedChargesForm;
  recipe?: RecipeForm;
  recipeDefaultsGeneration?: number;
};

export function loadWizardSession(): WizardSession | null {
  if (typeof window === "undefined") return null;
  try {
    const rawV2 = sessionStorage.getItem(STORAGE_KEY_V2);
    if (rawV2) return JSON.parse(rawV2) as WizardSession;

    const rawV1 = sessionStorage.getItem(STORAGE_KEY_V1);
    if (!rawV1) return null;

    const legacy = JSON.parse(rawV1) as WizardSession;
    sessionStorage.removeItem(STORAGE_KEY_V1);
    saveWizardSession({
      ...legacy,
      recipeDefaultsGeneration: legacy.recipeDefaultsGeneration ?? 0,
    });
    return loadWizardSession();
  } catch {
    return null;
  }
}

export function saveWizardSession(session: WizardSession): void {
  sessionStorage.setItem(STORAGE_KEY_V2, JSON.stringify(session));
}

export function saveFixedCharges(fixedCharges: FixedChargesForm): void {
  const prev = loadWizardSession();
  saveWizardSession({
    fixedCharges,
    ...(prev?.recipe ? { recipe: prev.recipe } : {}),
  });
}

export function saveRecipe(
  recipe: RecipeForm,
  options?: { recipeDefaultsGeneration?: number },
): void {
  const prev = loadWizardSession();
  if (!prev?.fixedCharges) return;
  saveWizardSession({
    fixedCharges: prev.fixedCharges,
    recipe,
    recipeDefaultsGeneration:
      options?.recipeDefaultsGeneration ?? prev.recipeDefaultsGeneration,
  });
}
