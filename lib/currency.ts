/** Amounts entered in the calculator are treated as Moroccan dirhams (MAD). */
export type DisplayCurrency = "MAD" | "EUR" | "USD";

export const DISPLAY_CURRENCIES: readonly DisplayCurrency[] = [
  "MAD",
  "EUR",
  "USD",
] as const;

const LOCALE_FOR: Record<DisplayCurrency, string> = {
  MAD: "fr-MA",
  EUR: "fr-FR",
  USD: "en-US",
};

function madPerUnit(currency: Exclude<DisplayCurrency, "MAD">): number {
  if (currency === "EUR") {
    const n = Number.parseFloat(process.env.NEXT_PUBLIC_MAD_PER_EUR ?? "10.85");
    return Number.isFinite(n) && n > 0 ? n : 10.85;
  }
  const n = Number.parseFloat(process.env.NEXT_PUBLIC_MAD_PER_USD ?? "10");
  return Number.isFinite(n) && n > 0 ? n : 10;
}

/** Convert an amount stored in MAD to another display currency. */
export function convertFromMad(
  amountMad: number,
  currency: DisplayCurrency,
): number {
  if (currency === "MAD") return amountMad;
  return amountMad / madPerUnit(currency);
}

export function formatInCurrency(
  value: number,
  currency: DisplayCurrency,
): string {
  return new Intl.NumberFormat(LOCALE_FOR[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "MAD" ? 2 : 2,
  }).format(value);
}

export function formatFromMad(
  amountMad: number,
  currency: DisplayCurrency,
): string {
  return formatInCurrency(convertFromMad(amountMad, currency), currency);
}

export function fxRatesLabel(): string {
  return `1 € ≈ ${madPerUnit("EUR")} MAD · 1 $ ≈ ${madPerUnit("USD")} MAD`;
}
