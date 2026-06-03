import { convertToMad, type DisplayCurrency } from "@/lib/currency";

export function parsePositive(value: string): number | null {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function parseNonNegative(value: string): number | null {
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0) return null;
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
  const n = Number.parseFloat(value);
  if (!Number.isFinite(n) || n < 0 || n >= 100) return null;
  return n / 100;
}
