import { calculateCosting } from "@/engine";
import type { Capacity, CostingInput } from "@/engine/types";
import { parsePositive } from "@/lib/parse";

export type CapacityMode = "batches_per_month" | "hours_per_month";

export type ChargeLinePreset =
  | "rent"
  | "energy"
  | "insurance"
  | "subscriptions"
  | "custom";

export type FixedChargeLine = {
  id: string;
  preset: ChargeLinePreset;
  customLabel?: string;
  amount: string;
};

export type FixedChargesForm = {
  chargeLines: FixedChargeLine[];
  capacityMode: CapacityMode;
  batchesPerMonth: string;
  hoursPerMonth: string;
  recipeTotalHours: string;
};

export const DEFAULT_CHARGE_LINES: FixedChargeLine[] = [
  { id: "rent", preset: "rent", amount: "600" },
  { id: "energy", preset: "energy", amount: "200" },
  { id: "insurance", preset: "insurance", amount: "150" },
  { id: "subscriptions", preset: "subscriptions", amount: "150" },
];

export const DEFAULT_FIXED_CHARGES: FixedChargesForm = {
  chargeLines: DEFAULT_CHARGE_LINES,
  capacityMode: "batches_per_month",
  batchesPerMonth: "40",
  hoursPerMonth: "120",
  recipeTotalHours: "2.25",
};

function newChargeLineId(): string {
  return `charge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createCustomChargeLine(): FixedChargeLine {
  return { id: newChargeLineId(), preset: "custom", customLabel: "", amount: "" };
}

/** Sum of line amounts; null if any filled line is invalid. */
export function monthlyFixedTotal(lines: FixedChargeLine[]): number | null {
  let sum = 0;
  for (const line of lines) {
    const trimmed = line.amount.trim();
    if (!trimmed) continue;
    const value = parsePositive(line.amount);
    if (value === null) return null;
    sum += value;
  }
  return sum;
}

/** Migrate wizard sessions saved with a single monthly total field. */
export function normalizeFixedChargesForm(
  raw: Partial<FixedChargesForm> & { monthlyFixedCharges?: string },
): FixedChargesForm {
  if (raw.chargeLines?.length) {
    return {
      ...DEFAULT_FIXED_CHARGES,
      ...raw,
      chargeLines: raw.chargeLines,
    };
  }

  const legacy = raw.monthlyFixedCharges?.trim();
  const chargeLines = DEFAULT_CHARGE_LINES.map((line, index) =>
    index === 0 && legacy
      ? { ...line, amount: legacy }
      : { ...line, amount: line.amount },
  );

  return {
    ...DEFAULT_FIXED_CHARGES,
    capacityMode: raw.capacityMode ?? DEFAULT_FIXED_CHARGES.capacityMode,
    batchesPerMonth:
      raw.batchesPerMonth ?? DEFAULT_FIXED_CHARGES.batchesPerMonth,
    hoursPerMonth: raw.hoursPerMonth ?? DEFAULT_FIXED_CHARGES.hoursPerMonth,
    recipeTotalHours:
      raw.recipeTotalHours ?? DEFAULT_FIXED_CHARGES.recipeTotalHours,
    chargeLines,
  };
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
  monthlyTotal: number;
  input: CostingInput;
} | null {
  const monthlyFixed = monthlyFixedTotal(form.chargeLines);
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
    return {
      fixedLoadAllocated: result.fixedLoadAllocated,
      monthlyTotal: monthlyFixed,
      input,
    };
  } catch {
    return null;
  }
}
