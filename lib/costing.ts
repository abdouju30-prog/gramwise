import { calculateCosting } from "@/engine";
import type { CostingInput, CostingResult } from "@/engine/types";
import {
  buildShopCapacity,
  monthlyFixedTotal,
  type FixedChargesForm,
} from "@/lib/fixed-charges";
import type { DisplayCurrency } from "@/lib/currency";
import { parsePercentToFraction } from "@/lib/parse";
import {
  parseIngredients,
  parseLaborPhases,
  recipeLaborHours,
  type RecipeForm,
} from "@/lib/recipe";

export function buildCostingInput(
  fixed: FixedChargesForm,
  recipe: RecipeForm,
  entryCurrency: DisplayCurrency = "MAD",
): CostingInput | null {
  const monthlyFixed = monthlyFixedTotal(fixed.chargeLines, entryCurrency);
  const ingredients = parseIngredients(recipe.ingredients, entryCurrency);
  const laborPhases = parseLaborPhases(recipe.laborPhases, entryCurrency);
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
  const capacity = buildShopCapacity(
    fixed,
    fixed.capacityMode === "hours_per_month" ? laborHours : undefined,
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
  entryCurrency: DisplayCurrency = "MAD",
): { input: CostingInput; result: CostingResult } | null {
  const input = buildCostingInput(fixed, recipe, entryCurrency);
  if (!input) return null;
  try {
    return { input, result: calculateCosting(input) };
  } catch {
    return null;
  }
}
