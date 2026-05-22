import { roundCurrency } from "./round.js";
import type { CostingInput, CostingResult, Capacity } from "./types.js";

function ingredientSubtotal(
  ingredients: CostingInput["ingredients"],
): number {
  return ingredients.reduce(
    (sum, line) => sum + line.quantity * line.costPerUnit,
    0,
  );
}

function laborTotal(phases: CostingInput["laborPhases"]): number {
  return phases.reduce((sum, p) => sum + p.hours * p.hourlyRate, 0);
}

function recipeTotalHours(phases: CostingInput["laborPhases"]): number {
  return phases.reduce((sum, p) => sum + p.hours, 0);
}

function allocateFixedLoad(
  monthlyFixed: number,
  capacity: Capacity,
  laborPhases: CostingInput["laborPhases"],
): number {
  if (capacity.mode === "batches_per_month") {
    if (capacity.batchesPerMonth <= 0) {
      throw new Error("batches_per_month must be positive");
    }
    return roundCurrency(monthlyFixed / capacity.batchesPerMonth);
  }
  if (capacity.hoursPerMonth <= 0) {
    throw new Error("hours_per_month must be positive");
  }
  const hours =
    capacity.recipeTotalHours ?? recipeTotalHours(laborPhases);
  return roundCurrency(
    (monthlyFixed / capacity.hoursPerMonth) * hours,
  );
}

/**
 * Margin on selling price: price = full_cost / (1 - margin_fraction).
 * Not markup-on-cost (full_cost * (1 + margin)).
 */
export function recommendedFromFullCost(
  fullCost: number,
  marginFraction: number,
): number {
  if (marginFraction >= 1) {
    throw new Error("margin_fraction must be less than 1");
  }
  const divisor = 1 - marginFraction;
  return roundCurrency(fullCost / divisor);
}

/** Markup-on-cost (non-default); for tests / future toggle only */
export function priceIfMarkupOnCost(
  fullCost: number,
  markupFraction: number,
): number {
  return roundCurrency(fullCost * (1 + markupFraction));
}

export function calculateCosting(input: CostingInput): CostingResult {
  const subtotal = ingredientSubtotal(input.ingredients);
  const directMaterials = roundCurrency(
    subtotal * (1 + input.wasteFraction),
  );
  const directLabor = roundCurrency(laborTotal(input.laborPhases));
  const fixedLoadAllocated = allocateFixedLoad(
    input.monthlyFixedCharges,
    input.capacity,
    input.laborPhases,
  );
  const fullCost = roundCurrency(
    directMaterials + directLabor + fixedLoadAllocated,
  );
  const breakEvenPrice = fullCost;
  const recommendedPrice = recommendedFromFullCost(
    fullCost,
    input.marginFraction,
  );

  const yieldCount = input.yieldCount ?? 1;
  const result: CostingResult = {
    directMaterials,
    directLabor,
    fixedLoadAllocated,
    fullCost,
    breakEvenPrice,
    recommendedPrice,
  };

  if (yieldCount > 1) {
    if (yieldCount <= 0) {
      throw new Error("yield_count must be positive");
    }
    result.perUnit = {
      breakEvenPrice: roundCurrency(breakEvenPrice / yieldCount),
      recommendedPrice: roundCurrency(recommendedPrice / yieldCount),
    };
  }

  return result;
}
