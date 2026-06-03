import { calculateCosting } from "@/engine";
import type { CostingInput, CostingResult } from "@/engine/types";
import { monthlyFixedTotal, type FixedChargesForm } from "@/lib/fixed-charges";
import { parsePercentToFraction } from "@/lib/parse";
import {
  buildRecipeCapacity,
  parseIngredients,
  parseLaborPhases,
  recipeLaborHours,
  type RecipeForm,
} from "@/lib/recipe";

export function buildCostingInput(
  fixed: FixedChargesForm,
  recipe: RecipeForm,
): CostingInput | null {
  const monthlyFixed = monthlyFixedTotal(fixed.chargeLines);
  const ingredients = parseIngredients(recipe.ingredients);
  const laborPhases = parseLaborPhases(recipe.laborPhases);
  const wasteFraction = parsePercentToFraction(recipe.wastePercent);
  const marginFraction = parsePercentToFraction(recipe.marginPercent);

  if (
    monthlyFixed === null ||
    ingredients === null ||
    laborPhases === null ||
    wasteFraction === null ||
    marginFraction === null
  ) {
    return null;
  }

  const laborHours = recipeLaborHours(laborPhases);
  const capacity = buildRecipeCapacity(
    recipe,
    recipe.capacityMode === "hours_per_month" ? laborHours : undefined,
  );

  if (capacity === null) return null;

  return {
    monthlyFixedCharges: monthlyFixed,
    capacity,
    ingredients,
    laborPhases,
    wasteFraction,
    marginFraction,
  };
}

export function runCosting(
  fixed: FixedChargesForm,
  recipe: RecipeForm,
): { input: CostingInput; result: CostingResult } | null {
  const input = buildCostingInput(fixed, recipe);
  if (!input) return null;
  try {
    return { input, result: calculateCosting(input) };
  } catch {
    return null;
  }
}
