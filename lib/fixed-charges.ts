import { calculateCosting } from "@/engine";
import type { Capacity, CostingInput } from "@/engine/types";
import type { DisplayCurrency } from "@/lib/currency";
import { parsePositive, parsePositiveInMad } from "@/lib/parse";
import type { RecipeForm } from "@/lib/recipe";

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

export const DEFAULT_SHOP_CAPACITY = {
  capacityMode: "batches_per_month" as CapacityMode,
  batchesPerMonth: "120",
  hoursPerMonth: "160",
};

export type FixedChargesForm = {
  chargeLines: FixedChargeLine[];
  capacityMode: CapacityMode;
  batchesPerMonth: string;
  hoursPerMonth: string;
};

/** Legacy session / saved recipe may still carry per-recipe capacity. */
export type LegacyCapacityFields = {
  capacityMode?: CapacityMode;
  batchesPerMonth?: string;
  hoursPerMonth?: string;
  monthlyFixedCharges?: string;
};

export const DEFAULT_CHARGE_LINES: FixedChargeLine[] = [
  { id: "rent", preset: "rent", amount: "600" },
  { id: "energy", preset: "energy", amount: "200" },
  { id: "insurance", preset: "insurance", amount: "150" },
  { id: "subscriptions", preset: "subscriptions", amount: "150" },
];

export const DEFAULT_FIXED_CHARGES: FixedChargesForm = {
  chargeLines: DEFAULT_CHARGE_LINES,
  ...DEFAULT_SHOP_CAPACITY,
};

function newChargeLineId(): string {
  return `charge-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createCustomChargeLine(): FixedChargeLine {
  return { id: newChargeLineId(), preset: "custom", customLabel: "", amount: "" };
}

/** Sum of line amounts; null if any filled line is invalid. Values converted to MAD. */
export function monthlyFixedTotal(
  lines: FixedChargeLine[],
  entryCurrency: DisplayCurrency = "MAD",
): number | null {
  let sum = 0;
  for (const line of lines) {
    const trimmed = line.amount.trim();
    if (!trimmed) continue;
    const value = parsePositiveInMad(line.amount, entryCurrency);
    if (value === null) return null;
    sum += value;
  }
  return sum;
}

export function normalizeFixedChargesForm(
  raw: Partial<FixedChargesForm> & LegacyCapacityFields,
): FixedChargesForm {
  const chargeLines = raw.chargeLines?.length
    ? raw.chargeLines
    : (() => {
        const legacy = raw.monthlyFixedCharges?.trim();
        return DEFAULT_CHARGE_LINES.map((line, index) =>
          index === 0 && legacy
            ? { ...line, amount: legacy }
            : { ...line, amount: line.amount },
        );
      })();

  return {
    chargeLines,
    capacityMode:
      raw.capacityMode ?? DEFAULT_SHOP_CAPACITY.capacityMode,
    batchesPerMonth:
      raw.batchesPerMonth ?? DEFAULT_SHOP_CAPACITY.batchesPerMonth,
    hoursPerMonth:
      raw.hoursPerMonth ?? DEFAULT_SHOP_CAPACITY.hoursPerMonth,
  };
}

/** Pull shop capacity from an old per-recipe save into fixed charges (once). */
export function mergeCapacityFromRecipe(
  fixed: FixedChargesForm,
  recipe?: LegacyCapacityFields | null,
): FixedChargesForm {
  if (!recipe?.capacityMode) return fixed;
  return {
    ...fixed,
    capacityMode: recipe.capacityMode,
    batchesPerMonth:
      recipe.batchesPerMonth ?? fixed.batchesPerMonth,
    hoursPerMonth: recipe.hoursPerMonth ?? fixed.hoursPerMonth,
  };
}

export function buildShopCapacity(
  fixed: FixedChargesForm,
  recipeLaborHours?: number,
): Capacity | null {
  if (fixed.capacityMode === "batches_per_month") {
    const batches = parsePositive(fixed.batchesPerMonth);
    if (batches === null) return null;
    return { mode: "batches_per_month", batchesPerMonth: batches };
  }
  const hoursPerMonth = parsePositive(fixed.hoursPerMonth);
  if (hoursPerMonth === null || recipeLaborHours === undefined) return null;
  if (recipeLaborHours <= 0) return null;
  return {
    mode: "hours_per_month",
    hoursPerMonth,
    recipeTotalHours: recipeLaborHours,
  };
}

export function previewShopFixedPerBatch(
  fixed: FixedChargesForm,
  entryCurrency: DisplayCurrency = "MAD",
): {
  fixedLoadAllocated: number;
  monthlyTotal: number;
} | null {
  const monthlyFixed = monthlyFixedTotal(fixed.chargeLines, entryCurrency);
  const capacity = buildShopCapacity(fixed);
  if (monthlyFixed === null || capacity === null) return null;
  if (capacity.mode !== "batches_per_month") return null;

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
    };
  } catch {
    return null;
  }
}
