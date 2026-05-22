import Link from "next/link";

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

      <section className="landing-section" id="pricing">
        <h2 className="landing-heading">Pricing</h2>
        <p className="landing-pricing-note">
          Beta: calculator is free while we validate with real bakers. Paid plans
          open when Stripe checkout ships.
        </p>
        <div className="pricing-grid">
          <article className="card pricing-card pricing-card--featured">
            <p className="pricing-label">Best for solo shops</p>
            <h3>Lifetime</h3>
            <p className="pricing-price">
              €99 <span className="pricing-period">once</span>
            </p>
            <ul className="pricing-features">
              <li>Unlimited recipes</li>
              <li>Full cost breakdown</li>
              <li>No subscription</li>
            </ul>
            <span className="btn btn-primary btn-disabled">Checkout soon</span>
          </article>
          <article className="card pricing-card">
            <p className="pricing-label">Flexible</p>
            <h3>Monthly</h3>
            <p className="pricing-price">
              €29 <span className="pricing-period">/ month</span>
            </p>
            <ul className="pricing-features">
              <li>Same features</li>
              <li>Cancel anytime</li>
            </ul>
            <span className="btn btn-ghost btn-disabled">Checkout soon</span>
          </article>
        </div>
        <p className="landing-pricing-cta">
          <Link href="/start" className="btn btn-primary">
            Use the free calculator now
          </Link>
        </p>
      </section>

      <footer className="landing-footer">
        <p>
          GramWise · Pastry costing · Engine tested on reference cases ·{" "}
          <Link href="/start">App</Link>
        </p>
      </footer>
    </main>
  );
}
