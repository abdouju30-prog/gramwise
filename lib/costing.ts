import { calculateCosting } from "@/engine";
import type { Capacity, CostingInput, CostingResult } from "@/engine/types";
import { buildCapacity, type FixedChargesForm } from "@/lib/fixed-charges";
import { parsePercentToFraction, parsePositive } from "@/lib/parse";
import {
  parseIngredients,
  parseLaborPhases,
  recipeLaborHours,
  type RecipeForm,
} from "@/lib/recipe";

export function buildCostingInput(
  fixed: FixedChargesForm,
  recipe: RecipeForm,
): CostingInput | null {
  const monthlyFixed = parsePositive(fixed.monthlyFixedCharges);
  let capacity = buildCapacity(fixed);
  const ingredients = parseIngredients(recipe.ingredients);
  const laborPhases = parseLaborPhases(recipe.laborPhases);
  const wasteFraction = parsePercentToFraction(recipe.wastePercent);
  const marginFraction = parsePercentToFraction(recipe.marginPercent);

  if (
    monthlyFixed === null ||
    capacity === null ||
    ingredients === null ||
    laborPhases === null ||
    wasteFraction === null ||
    marginFraction === null
  ) {
    return null;
  }

  if (capacity.mode === "hours_per_month") {
    capacity = {
      ...capacity,
      recipeTotalHours: recipeLaborHours(laborPhases),
    };
  }

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
