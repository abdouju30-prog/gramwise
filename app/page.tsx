import Link from "next/link";
import { PricingSection } from "./components/pricing-section";

const BENEFITS = [
  {
    title: "Numbers you can defend",
    body: "Costing engine validated against 10 Excel reference recipes — materials, labor, and fixed load spelled out.",
  },
  {
    title: "Margin on selling price",
    body: "Default formula matches how bakers think: target margin % on the price tag, not markup-on-cost.",
  },
  {
    title: "Built for pastry",
    body: "Spread monthly rent and utilities across batches or shop hours, then price each recipe run.",
  },
] as const;

const STEPS = [
  "Enter monthly fixed charges and capacity",
  "Add ingredients, labor phases, waste %",
  "Get break-even and recommended selling price",
] as const;

export default function LandingPage() {
  return (
    <main className="landing">
      <section className="landing-hero">
        <p className="eyebrow">For artisan pastry businesses</p>
        <h1>
          Know your real cost before you{" "}
          <span className="brand-accent">set the price</span>
        </h1>
        <p className="lead landing-lead">
          GramWise spreads overhead across production, builds recipe cost line by
          line, and recommends a selling price — no spreadsheet guesswork.
        </p>
        <div className="landing-actions">
          <Link href="/start" className="btn btn-primary btn-lg">
            Open the calculator
          </Link>
          <Link href="/fixed-charges" className="btn btn-ghost btn-lg">
            Jump to step 1
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">Why bakers use it</h2>
        <ul className="benefit-grid">
          {BENEFITS.map((b) => (
            <li key={b.title} className="card benefit-card">
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">How it works</h2>
        <ol className="steps-list">
          {STEPS.map((text, i) => (
            <li key={text}>
              <span className="steps-list-num">{i + 1}</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <PricingSection />

      <footer className="landing-footer">
        <p>
          GramWise · Pastry costing · Engine tested on reference cases ·{" "}
          <Link href="/start">App</Link>
        </p>
      </footer>
    </main>
  );
}
