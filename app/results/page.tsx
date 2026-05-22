import { ResultsView } from "./results-view";

export default function ResultsPage() {
  return (
    <main className="main-wide">
      <p className="eyebrow">Step 3 of 3</p>
      <h1>Results</h1>
      <p className="lead">Full cost breakdown and recommended selling price.</p>
      <ResultsView />
    </main>
  );
}
