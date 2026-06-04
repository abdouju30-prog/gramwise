"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { FixedChargesForm } from "./fixed-charges-form";

export default function FixedChargesPage() {
  const m = useMessages();

  return (
    <main>
      <div className="wizard-page-header" data-step="1">
        <p className="wizard-step-label">{m.fixed.eyebrow}</p>
        <h1>{m.fixed.title}</h1>
        <p className="lead">{m.fixed.lead}</p>
      </div>
      <FixedChargesForm />
    </main>
  );
}
