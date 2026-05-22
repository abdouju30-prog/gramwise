"use client";

import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";
import { CheckoutButton } from "./checkout-button";
import { isStripeConfigured } from "@/lib/stripe";

export function PricingSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const paymentsReady = isStripeConfigured() && !publicBeta;

  if (publicBeta) {
    return (
      <section className="landing-section" id="pricing">
        <h2 className="landing-heading">{m.landing.pricingBetaTitle}</h2>
        <p className="landing-pricing-note">{m.landing.pricingBetaNote}</p>
        <p className="landing-pricing-cta">
          <Link href="/beta" className="btn btn-primary">
            {m.landing.guideTester}
          </Link>
          <Link href="/start" className="btn btn-ghost">
            {m.landing.openCalculator}
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="landing-section" id="pricing">
      <h2 className="landing-heading">{m.landing.pricingTitle}</h2>
      <p className="landing-pricing-note">
        {paymentsReady
          ? m.landing.pricingNoteReady
          : m.landing.pricingNoteFree}
      </p>
      <div className="pricing-grid">
        <article className="card pricing-card pricing-card--featured">
          <p className="pricing-label">{m.landing.lifetimeLabel}</p>
          <h3>{m.landing.lifetimeTitle}</h3>
          <p className="pricing-price">
            €99 <span className="pricing-period">{m.landing.lifetimeOnce}</span>
          </p>
          <ul className="pricing-features">
            {m.landing.lifetimeFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {paymentsReady ? (
            <CheckoutButton plan="lifetime" className="btn btn-primary">
              {m.landing.lifetimeCta}
            </CheckoutButton>
          ) : (
            <span className="btn btn-primary btn-disabled">
              {m.landing.checkoutSoon}
            </span>
          )}
        </article>
        <article className="card pricing-card">
          <p className="pricing-label">{m.landing.monthlyLabel}</p>
          <h3>{m.landing.monthlyTitle}</h3>
          <p className="pricing-price">
            €29 <span className="pricing-period">{m.landing.monthlyPeriod}</span>
          </p>
          <ul className="pricing-features">
            {m.landing.monthlyFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {paymentsReady ? (
            <CheckoutButton plan="monthly" className="btn btn-ghost">
              {m.landing.monthlyCta}
            </CheckoutButton>
          ) : (
            <span className="btn btn-ghost btn-disabled">
              {m.landing.checkoutSoon}
            </span>
          )}
        </article>
      </div>
      <p className="landing-pricing-cta">
        <Link href="/start" className="btn btn-primary">
          {m.landing.freeCalculator}
        </Link>
      </p>
    </section>
  );
}
