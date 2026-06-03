import type { DisplayCurrency } from "@/lib/currency";
import type { FixedChargesForm } from "@/lib/fixed-charges";
import { parsePositive, parsePositiveInMad } from "@/lib/parse";

/** UI placeholders only — user must enter their country’s minimum wage. */
export const EXAMPLE_SMIG_MONTHLY = "3119";
export const EXAMPLE_SMIG_HOURS_PER_MONTH = "191";

export type SmigLaborOptions = {
  smigHourlyMad: number | null;
  laborByOwner: boolean;
};

export function parseSmigHourlyMad(
  form: Partial<Pick<FixedChargesForm, "smigMonthlyMad" | "smigHoursPerMonth">>,
  entryCurrency: DisplayCurrency = "MAD",
): number | null {
  const monthlyRaw = form.smigMonthlyMad?.trim() ?? "";
  const hoursRaw = form.smigHoursPerMonth?.trim() ?? "";
  if (!monthlyRaw || !hoursRaw) return null;

  const monthly = parsePositiveInMad(monthlyRaw, entryCurrency);
  const hours = parsePositive(hoursRaw);
  if (monthly === null || hours === null || hours <= 0) return null;
  return monthly / hours;
}

export function smigLaborOptionsFromFixed(
  fixed: FixedChargesForm,
  laborByOwner: boolean,
  entryCurrency: DisplayCurrency = "MAD",
): SmigLaborOptions {
  return {
    smigHourlyMad: parseSmigHourlyMad(fixed, entryCurrency),
    laborByOwner,
  };
}

export function effectiveLaborHourlyMad(
  enteredRateMad: number | null,
  smigHourlyMad: number | null,
  laborByOwner: boolean,
): number | null {
  let rate = enteredRateMad;
  if (rate === null && smigHourlyMad !== null) rate = smigHourlyMad;
  if (rate === null) return null;
  if (laborByOwner && smigHourlyMad !== null && rate < smigHourlyMad) {
    return smigHourlyMad;
  }
  return rate;
}
