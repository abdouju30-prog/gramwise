"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { normalizeFixedChargesForm } from "@/lib/fixed-charges";
import { loadWizardSession, saveWizardSession, type WizardSession } from "@/lib/session";

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
    const fixedCharges = normalizeFixedChargesForm(data.fixedCharges);
    const session: WizardSession = { ...data, fixedCharges };
    if (
      fixedCharges.smigMonthlyMad !== data.fixedCharges.smigMonthlyMad ||
      fixedCharges.smigHoursPerMonth !== data.fixedCharges.smigHoursPerMonth
    ) {
      saveWizardSession(session);
    }
    if (require === "recipe" && !session.recipe) {
      router.replace("/recipe");
      return;
    }
    setSession(session);
  }, [router, require]);

  return session;
}
