"use client";

import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import {
  isGumroadConfigured,
  isGumroadMonthlyConfigured,
} from "@/lib/gumroad";
import { useMessages } from "@/lib/i18n/locale-provider";
import { CheckoutButton } from "./checkout-button";
import { GumroadCheckoutButton } from "./gumroad-checkout-button";
import { isStripeConfigured } from "@/lib/stripe";

function LifetimeCta({
  paymentsReady,
  useGumroad,
  className,
  label,
  soonLabel,
}: {
  paymentsReady: boolean;
  useGumroad: boolean;
  className: string;
  label: string;
  soonLabel: string;
}) {
  if (!paymentsReady) {
    return <span className={`${className} btn-disabled`}>{soonLabel}</span>;
  }
  if (useGumroad) {
    return (
      <GumroadCheckoutButton plan="lifetime" className={className}>
        {label}
      </GumroadCheckoutButton>
    );
  }
  return (
    <CheckoutButton plan="lifetime" className={className}>
      {label}
    </CheckoutButton>
  );
}

function MonthlyCta({
  paymentsReady,
  useGumroad,
  monthlyAvailable,
  className,
  label,
  soonLabel,
}: {
  paymentsReady: boolean;
  useGumroad: boolean;
  monthlyAvailable: boolean;
  className: string;
  label: string;
  soonLabel: string;
}) {
  if (!paymentsReady || !monthlyAvailable) {
    return <span className={`${className} btn-disabled`}>{soonLabel}</span>;
  }
  if (useGumroad) {
    return (
      <GumroadCheckoutButton plan="monthly" className={className}>
        {label}
      </GumroadCheckoutButton>
    );
  }
  return (
    <CheckoutButton plan="monthly" className={className}>
      {label}
    </CheckoutButton>
  );
}

export function PricingSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const useGumroad = isGumroadConfigured();
  const useStripe = isStripeConfigured() && !useGumroad;
  const paymentsReady = useGumroad || useStripe;
  const monthlyGumroad = useGumroad && isGumroadMonthlyConfigured();

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
          <LifetimeCta
            paymentsReady={paymentsReady}
            useGumroad={useGumroad}
            className="btn btn-primary"
            label={m.landing.lifetimeCta}
            soonLabel={m.landing.checkoutSoon}
          />
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
          <MonthlyCta
            paymentsReady={paymentsReady}
            useGumroad={useGumroad}
            monthlyAvailable={useGumroad ? monthlyGumroad : useStripe}
            className="btn btn-ghost"
            label={m.landing.monthlyCta}
            soonLabel={m.landing.checkoutSoon}
          />
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
