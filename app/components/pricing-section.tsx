import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import { CheckoutButton } from "./checkout-button";
import { isStripeConfigured } from "@/lib/stripe";

export function PricingSection() {
  const publicBeta = isPublicBeta();
  const paymentsReady = isStripeConfigured() && !publicBeta;

  if (publicBeta) {
    return (
      <section className="landing-section" id="pricing">
        <h2 className="landing-heading">Beta — gratuit</h2>
        <p className="landing-pricing-note">
          Le calculateur est ouvert sans paiement. Nous validons les chiffres
          avec 5 pâtissiers avant toute offre payante.
        </p>
        <p className="landing-pricing-cta">
          <Link href="/beta" className="btn btn-primary">
            Guide testeur (15 min)
          </Link>
          <Link href="/start" className="btn btn-ghost">
            Ouvrir le calculateur
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className="landing-section" id="pricing">
      <h2 className="landing-heading">Pricing</h2>
      <p className="landing-pricing-note">
        {paymentsReady
          ? "Secure checkout via Stripe."
          : "Calculator is free until checkout is configured."}
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
          {paymentsReady ? (
            <CheckoutButton plan="lifetime" className="btn btn-primary">
              Get lifetime access
            </CheckoutButton>
          ) : (
            <span className="btn btn-primary btn-disabled">Checkout soon</span>
          )}
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
          {paymentsReady ? (
            <CheckoutButton plan="monthly" className="btn btn-ghost">
              Subscribe monthly
            </CheckoutButton>
          ) : (
            <span className="btn btn-ghost btn-disabled">Checkout soon</span>
          )}
        </article>
      </div>
      <p className="landing-pricing-cta">
        <Link href="/start" className="btn btn-primary">
          Use the free calculator now
        </Link>
      </p>
    </section>
  );
}
