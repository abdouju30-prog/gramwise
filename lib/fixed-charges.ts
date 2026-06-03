import type { DisplayCurrency } from "@/lib/currency";
import { parsePositiveInMad } from "@/lib/parse";

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
};

/** Session saved before capacity moved off step 1. */
export type LegacyFixedChargesForm = FixedChargesForm & {
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
  raw: LegacyFixedChargesForm,
): FixedChargesForm {
  if (raw.chargeLines?.length) {
    return { chargeLines: raw.chargeLines };
  }

  const legacy = raw.monthlyFixedCharges?.trim();
  const chargeLines = DEFAULT_CHARGE_LINES.map((line, index) =>
    index === 0 && legacy
      ? { ...line, amount: legacy }
      : { ...line, amount: line.amount },
  );

  return { chargeLines };
}

export function extractLegacyCapacity(
  raw: LegacyFixedChargesForm | undefined,
): {
  capacityMode?: CapacityMode;
  batchesPerMonth?: string;
  hoursPerMonth?: string;
} | null {
  if (!raw?.capacityMode) return null;
  return {
    capacityMode: raw.capacityMode,
    batchesPerMonth: raw.batchesPerMonth,
    hoursPerMonth: raw.hoursPerMonth,
  };
}
