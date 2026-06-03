import { describe, expect, it } from "vitest";
import { buildMonthlyReport } from "@/lib/monthly-report";
import type { FixedChargesForm } from "@/lib/fixed-charges";
import type { SavedRecipe } from "@/lib/recipe-library";
import type { RecipeForm } from "@/lib/recipe";

const fixed: FixedChargesForm = {
  chargeLines: [{ id: "r", preset: "rent", amount: "1000" }],
  smigMonthlyMad: "3119",
  smigHoursPerMonth: "191",
};

function recipe(overrides: Partial<RecipeForm> = {}): RecipeForm {
  return {
    name: "Test",
    ingredients: [{ id: "1", name: "Flour", quantity: "1", quantityUnit: "kg", costPerUnit: "10" }],
    laborPhases: [{ id: "l1", label: "Prep", hours: "1", hourlyRate: "20" }],
    laborByOwner: false,
    wastePercent: "0",
    marginPercent: "40",
    capacityMode: "batches_per_month",
    productionCountUnit: "batches",
    batchesPerMonth: "10",
    hoursPerMonth: "120",
    ...overrides,
  };
}

function saved(id: string, form: RecipeForm, name?: string): SavedRecipe {
  return {
    id,
    ownerId: "o1",
    name: name ?? form.name,
    savedAt: new Date().toISOString(),
    recipe: form,
  };
}

describe("buildMonthlyReport", () => {
  it("allocates fixed charges once across recipes by volume", () => {
    const report = buildMonthlyReport(fixed, [
      saved("a", recipe({ name: "A", batchesPerMonth: "10" })),
      saved("b", recipe({ name: "B", batchesPerMonth: "10" })),
    ]);

    expect(report.fixedChargesMonthly).toBe(1000);
    expect(report.completeCount).toBe(2);
    expect(report.sumFixedAllocated).toBeCloseTo(1000, 2);
    expect(report.grandTotal).toBeCloseTo(
      (report.sumMaterials ?? 0) + report.sumLabor + 1000,
      0,
    );
  });

  it("returns fixed-only total when no recipes", () => {
    const report = buildMonthlyReport(fixed, []);
    expect(report.grandTotal).toBe(1000);
    expect(report.rows).toHaveLength(0);
  });
});
