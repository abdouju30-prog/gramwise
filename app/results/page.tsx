"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { ResultsView } from "./results-view";

export default function ResultsPage() {
  const m = useMessages();

  return (
    <main className="main-wide">
      <p className="eyebrow">{m.results.eyebrow}</p>
      <h1>{m.results.title}</h1>
      <p className="lead">{m.results.lead}</p>
      <ResultsView />
    </main>
  );
}
