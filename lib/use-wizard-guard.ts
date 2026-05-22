"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadWizardSession, type WizardSession } from "@/lib/session";

export function useWizardGuard(
  require: "fixed" | "recipe",
): WizardSession | null {
  const router = useRouter();
  const [session, setSession] = useState<WizardSession | null>(null);

  useEffect(() => {
    const data = loadWizardSession();
    if (!data?.fixedCharges) {
      router.replace("/fixed-charges");
      return;
    }
    if (require === "recipe" && !data.recipe) {
      router.replace("/recipe");
      return;
    }
    setSession(data);
  }, [router, require]);

  return session;
}
