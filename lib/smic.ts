import type { DisplayCurrency } from "@/lib/currency";
import type { FixedChargesForm } from "@/lib/fixed-charges";
import { parsePositive, parsePositiveInMad } from "@/lib/parse";

/** Morocco SMIG (non-agricultural), indicative default — user adjusts on step 1. */
export const DEFAULT_SMIG_MONTHLY_MAD = "3119";
/** Statutory monthly hours basis for SMIG → hourly (191 h/mois). */
export const DEFAULT_SMIG_HOURS_PER_MONTH = "191";

export type SmigLaborOptions = {
  smigHourlyMad: number | null;
  laborByOwner: boolean;
};

export function parseSmigHourlyMad(
  form: Partial<Pick<FixedChargesForm, "smigMonthlyMad" | "smigHoursPerMonth">>,
  entryCurrency: DisplayCurrency = "MAD",
): number | null {
  const monthly = parsePositiveInMad(
    form.smigMonthlyMad?.trim() || DEFAULT_SMIG_MONTHLY_MAD,
    entryCurrency,
  );
  const hours = parsePositive(
    form.smigHoursPerMonth?.trim() || DEFAULT_SMIG_HOURS_PER_MONTH,
  );
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
