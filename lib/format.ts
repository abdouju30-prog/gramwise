import { formatFromMad, type DisplayCurrency } from "@/lib/currency";

/** Format a MAD amount (default display currency for the app). */
export function formatMoney(
  value: number,
  currency: DisplayCurrency = "MAD",
): string {
  return formatFromMad(value, currency);
}
