import { calculateCosting } from "@/engine";
import type { Capacity, CostingInput } from "@/engine/types";

export type CapacityMode = "batches_per_month" | "hours_per_month";

export type FixedChargesForm = {
  monthlyFixedCharges: string;
  capacityMode: CapacityMode;
  batchesPerMonth: string;
  hoursPerMonth: string;
  recipeTotalHours: string;
};

export const DEFAULT_FIXED_CHARGES: FixedChargesForm = {
  monthlyFixedCharges: "1100",
  capacityMode: "batches_per_month",
  batchesPerMonth: "40",
  hoursPerMonth: "120",
  recipeTotalHours: "2.25",
};

export function parsePositive(value: string): number | null {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function buildCapacity(form: FixedChargesForm): Capacity | null {
  if (form.capacityMode === "batches_per_month") {
    const batches = parsePositive(form.batchesPerMonth);
    if (batches === null) return null;
    return { mode: "batches_per_month", batchesPerMonth: batches };
  }
  const hoursPerMonth = parsePositive(form.hoursPerMonth);
  const recipeTotalHours = parsePositive(form.recipeTotalHours);
  if (hoursPerMonth === null || recipeTotalHours === null) return null;
  return {
    mode: "hours_per_month",
    hoursPerMonth,
    recipeTotalHours,
  };
}

/** Preview fixed load only — other costing lines stay zero until recipe screen exists. */
export function previewFixedLoad(form: FixedChargesForm): {
  fixedLoadAllocated: number;
  input: CostingInput;
} | null {
  const monthlyFixed = parsePositive(form.monthlyFixedCharges);
  const capacity = buildCapacity(form);
  if (monthlyFixed === null || capacity === null) return null;

  const input: CostingInput = {
    monthlyFixedCharges: monthlyFixed,
    capacity,
    ingredients: [],
    laborPhases: [],
    wasteFraction: 0,
    marginFraction: 0,
  };

  try {
    const result = calculateCosting(input);
    return { fixedLoadAllocated: result.fixedLoadAllocated, input };
  } catch {
    return null;
  }
}
