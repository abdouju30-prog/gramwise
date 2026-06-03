"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  detectLocale,
  getMessages,
  localeDirection,
  STORAGE_KEY,
  type Locale,
  type Messages,
} from "./index";
import {
  formatFromMad,
  loadEntryCurrency,
  saveEntryCurrency,
  type DisplayCurrency,
} from "@/lib/currency";

type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  entryCurrency: DisplayCurrency;
  setEntryCurrency: (currency: DisplayCurrency) => void;
  formatMoney: (amountMad: number) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [entryCurrency, setEntryCurrencyState] =
    useState<DisplayCurrency>("MAD");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(detectLocale());
    setEntryCurrencyState(loadEntryCurrency());
    setReady(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const setEntryCurrency = useCallback((next: DisplayCurrency) => {
    setEntryCurrencyState(next);
    saveEntryCurrency(next);
  }, []);

  const formatMoney = useCallback(
    (amountMad: number) => formatFromMad(amountMad, entryCurrency),
    [entryCurrency],
  );

  const dir = localeDirection(locale);
  const messages = useMemo(() => getMessages(locale), [locale]);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir, ready]);

  const value = useMemo(
    () => ({
      locale,
      messages,
      dir,
      setLocale,
      entryCurrency,
      setEntryCurrency,
      formatMoney,
    }),
    [locale, messages, dir, setLocale, entryCurrency, setEntryCurrency, formatMoney],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useMessages(): Messages {
  return useLocale().messages;
}
