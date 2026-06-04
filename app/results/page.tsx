"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { ResultsView } from "./results-view";

export default function ResultsPage() {
  const m = useMessages();

  return (
    <main className="main-wide">
      <div className="wizard-page-header" data-step="3">
        <p className="wizard-step-label">{m.results.eyebrow}</p>
        <h1>{m.results.title}</h1>
        <p className="lead">{m.results.lead}</p>
      </div>
      <ResultsView />
    </main>
  );
}
