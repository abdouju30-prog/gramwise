"use client";

import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import { isGumroadConfigured } from "@/lib/gumroad";
import { useMessages } from "@/lib/i18n/locale-provider";
import { CheckoutButton } from "./checkout-button";
import { GumroadCheckoutButton } from "./gumroad-checkout-button";
import { isStripeConfigured } from "@/lib/stripe";

export function PricingSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const useGumroad = isGumroadConfigured();
  const useStripe = isStripeConfigured() && !useGumroad;
  const paymentsReady = useGumroad || useStripe;

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

  const pricingNote = useGumroad
    ? m.landing.pricingNoteGumroad
    : paymentsReady
      ? m.landing.pricingNoteReady
      : m.landing.pricingNoteFree;

  return (
    <section className="landing-section" id="pricing">
      <h2 className="landing-heading">{m.landing.pricingTitle}</h2>
      <p className="landing-pricing-note">{pricingNote}</p>
      <div className="pricing-grid pricing-grid--single">
        <article className="card pricing-card pricing-card--featured">
          <p className="pricing-label">{m.landing.lifetimeLabel}</p>
          <h3>{m.landing.lifetimeTitle}</h3>
          <p className="pricing-price">
            €{m.landing.lifetimePrice}{" "}
            <span className="pricing-period">{m.landing.lifetimeOnce}</span>
          </p>
          <ul className="pricing-features">
            {m.landing.lifetimeFeatures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          {paymentsReady ? (
            useGumroad ? (
              <GumroadCheckoutButton plan="lifetime" className="btn btn-primary">
                {m.landing.lifetimeCta}
              </GumroadCheckoutButton>
            ) : (
              <CheckoutButton plan="lifetime" className="btn btn-primary">
                {m.landing.lifetimeCta}
              </CheckoutButton>
            )
          ) : (
            <span className="btn btn-primary btn-disabled">
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
