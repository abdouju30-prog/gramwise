"use client";

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/locale-provider";

export function LanguageSwitcher() {
  const { locale, setLocale, messages } = useLocale();

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={messages.lang.choose}
    >
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={`lang-switcher-btn${locale === code ? " lang-switcher-btn--active" : ""}`}
          aria-pressed={locale === code}
          onClick={() => setLocale(code as Locale)}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
