"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth-provider";
import { LocaleProvider } from "@/lib/i18n/locale-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <AuthProvider>{children}</AuthProvider>
    </LocaleProvider>
  );
}
