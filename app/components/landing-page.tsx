"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { LandingHeroSection } from "./landing-hero-section";
import { PricingSection } from "./pricing-section";

export function LandingPage() {
  const m = useMessages();

  return (
    <main className="landing">
      <LandingHeroSection />

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
