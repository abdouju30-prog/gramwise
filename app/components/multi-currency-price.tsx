import {
  DISPLAY_CURRENCIES,
  formatFromMad,
  type DisplayCurrency,
} from "@/lib/currency";

type Props = {
  amountMad: number;
  className?: string;
  /** Highlight first currency (recommended price hero). */
  primary?: DisplayCurrency;
};

export function MultiCurrencyPrice({
  amountMad,
  className = "",
  primary = "MAD",
}: Props) {
  const ordered = [
    primary,
    ...DISPLAY_CURRENCIES.filter((c) => c !== primary),
  ] as DisplayCurrency[];

  return (
    <ul className={`multi-currency-price ${className}`.trim()} aria-label="Prix">
      {ordered.map((currency, index) => (
        <li
          key={currency}
          className={
            index === 0
              ? "multi-currency-price-primary"
              : "multi-currency-price-alt"
          }
        >
          {formatFromMad(amountMad, currency)}
        </li>
      ))}
    </ul>
  );
}
