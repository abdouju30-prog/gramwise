import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { fr } from "./locales/fr";
import type { Locale, Messages } from "./types";

export type { Locale, Messages } from "./types";
export { LOCALES, LOCALE_LABELS } from "./types";

const CATALOG: Record<Locale, Messages> = { fr, ar, en };

export const DEFAULT_LOCALE: Locale = "fr";

export function getMessages(locale: Locale): Messages {
  return CATALOG[locale] ?? CATALOG[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return value === "fr" || value === "ar" || value === "en";
}

export function localeDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const STORAGE_KEY = "gramwise-locale";

export function detectLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("fr")) return "fr";
  return DEFAULT_LOCALE;
}
