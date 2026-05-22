import type { FixedChargesForm } from "@/lib/fixed-charges";
import type { RecipeForm } from "@/lib/recipe";

const STORAGE_KEY = "gramwise-wizard-v1";

export type WizardSession = {
  fixedCharges: FixedChargesForm;
  recipe?: RecipeForm;
};

export function loadWizardSession(): WizardSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WizardSession;
  } catch {
    return null;
  }
}

export function saveWizardSession(session: WizardSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function saveFixedCharges(fixedCharges: FixedChargesForm): void {
  const prev = loadWizardSession();
  saveWizardSession({
    fixedCharges,
    ...(prev?.recipe ? { recipe: prev.recipe } : {}),
  });
}

export function saveRecipe(recipe: RecipeForm): void {
  const prev = loadWizardSession();
  if (!prev?.fixedCharges) return;
  saveWizardSession({ fixedCharges: prev.fixedCharges, recipe });
}
