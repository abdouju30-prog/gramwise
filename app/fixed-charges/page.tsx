"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { FixedChargesForm } from "./fixed-charges-form";
import { WizardSettingsBar } from "./wizard-settings-bar";

export default function FixedChargesPage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.fixed.eyebrow}</p>
      <h1>{m.fixed.title}</h1>
      <p className="lead">{m.fixed.lead}</p>
      <WizardSettingsBar />
      <FixedChargesForm />
    </main>
  );
}
