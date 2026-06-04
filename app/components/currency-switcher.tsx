"use client";

import {
  CURRENCY_LABELS,
  DISPLAY_CURRENCIES,
  type DisplayCurrency,
} from "@/lib/currency";
import { useLocale } from "@/lib/i18n/locale-provider";

type Props = {
  className?: string;
};

export function CurrencySwitcher({ className }: Props) {
  const { entryCurrency, setEntryCurrency, messages } = useLocale();

  return (
    <div
      className={`lang-switcher currency-switcher${className ? ` ${className}` : ""}`}
      role="group"
      aria-label={messages.currency.choose}
      title={messages.currency.hint}
    >
      {DISPLAY_CURRENCIES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher-btn${entryCurrency === code ? " lang-switcher-btn--active" : ""}`}
          aria-pressed={entryCurrency === code}
          onClick={() => setEntryCurrency(code as DisplayCurrency)}
        >
          {CURRENCY_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
