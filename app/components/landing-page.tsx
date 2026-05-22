"use client";

import Link from "next/link";
import { PricingSection } from "./pricing-section";
import { useMessages } from "@/lib/i18n/locale-provider";

export function LandingPage() {
  const m = useMessages();

  return (
    <main className="landing">
      <section className="landing-hero">
        <p className="eyebrow">{m.landing.eyebrow}</p>
        <h1>
          {m.landing.heroBefore}{" "}
          <span className="brand-accent">{m.landing.heroAccent}</span>
        </h1>
        <p className="lead landing-lead">{m.landing.lead}</p>
        <div className="landing-actions">
          <Link href="/start" className="btn btn-primary btn-lg">
            {m.landing.openCalculator}
          </Link>
          <Link href="/beta" className="btn btn-ghost btn-lg">
            {m.landing.betaTesters}
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">{m.landing.whyTitle}</h2>
        <ul className="benefit-grid">
          {m.landing.benefits.map((b) => (
            <li key={b.title} className="card benefit-card">
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">{m.landing.howTitle}</h2>
        <ol className="steps-list">
          {m.landing.steps.map((text, i) => (
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
          {m.landing.footer}{" "}
          <Link href="/start">{m.landing.footerApp}</Link>
        </p>
      </footer>
    </main>
  );
}
