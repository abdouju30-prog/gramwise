import { convertToMad, type DisplayCurrency } from "@/lib/currency";

/** Accepts "24,99" and "24.99". */
export function parseDecimalString(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!normalized) return null;
  const n = Number.parseFloat(normalized);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function parsePositive(value: string): number | null {
  const n = parseDecimalString(value);
  if (n === null || n <= 0) return null;
  return n;
}

export function parseNonNegative(value: string): number | null {
  const n = parseDecimalString(value);
  if (n === null || n < 0) return null;
  return n;
}

export function parsePositiveInMad(
  value: string,
  currency: DisplayCurrency,
): number | null {
  const n = parsePositive(value);
  if (n === null) return null;
  return convertToMad(n, currency);
}

export function parseNonNegativeInMad(
  value: string,
  currency: DisplayCurrency,
): number | null {
  const n = parseNonNegative(value);
  if (n === null) return null;
  return convertToMad(n, currency);
}

/** Percent field → decimal fraction (40 → 0.4). */
export function parsePercentToFraction(value: string): number | null {
  const n = parseDecimalString(value);
  if (n === null || n < 0 || n >= 100) return null;
  return n / 100;
}
