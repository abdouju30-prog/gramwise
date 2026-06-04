"use client";

import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";
import { LandingProductDemo } from "./landing-product-demo";
import { HeroCanvas } from "./hero-canvas";
import { PricingSection } from "./pricing-section";

export function LandingPage() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const heroSteps = [m.nav.stepFixed, m.nav.stepRecipe, m.nav.stepResults];

  return (
    <main className="landing">
      <section className="landing-hero">
        <div className="landing-hero-body">
          <p className="hero-eyebrow">{m.landing.eyebrow}</p>
          <h1>
            {m.landing.heroBefore}{" "}
            <span className="brand-accent">{m.landing.heroAccent}</span>
          </h1>
          <p className="lead landing-lead">{m.landing.lead}</p>
          <ol className="hero-steps" aria-label={m.landing.howTitle}>
            {heroSteps.map((step, i) => (
              <li key={step} className="hero-step">
                <span className="hero-step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="landing-actions">
            <Link href="/start" className="btn btn-primary btn-lg">
              {m.landing.openCalculator}
            </Link>
            {publicBeta ? (
              <Link href="/beta" className="btn btn-ghost btn-lg">
                {m.landing.betaTesters}
              </Link>
            ) : (
              <Link href="/#pricing" className="btn btn-ghost btn-lg">
                {m.landing.viewPricing}
              </Link>
            )}
          </div>
        </div>

        <aside className="landing-hero-aside">
          <HeroCanvas />
          <LandingProductDemo />
        </aside>
      </section>

      <section className="landing-trust" aria-label={m.landing.trustTitle}>
        <p className="landing-trust-title">{m.landing.trustTitle}</p>
        <ul className="landing-trust-list">
          {m.landing.trustItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">{m.landing.whyTitle}</h2>
        <ul className="benefit-grid">
          {m.landing.benefits.map((b, i) => (
            <li key={b.title} className="benefit-card">
              <span className="benefit-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="landing-section">
        <h2 className="landing-heading">{m.landing.howTitle}</h2>
        <ol className="steps-list steps-list--cards">
          {m.landing.steps.map((text, i) => (
            <li key={text} className="steps-list-card">
              <span className="steps-list-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="steps-list-text">{text}</span>
            </li>
          ))}
        </ol>
      </section>

      <PricingSection />
    </main>
  );
}
