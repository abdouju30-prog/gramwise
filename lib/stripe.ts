import Stripe from "stripe";

export type CheckoutPlan = "lifetime" | "monthly";

const PLAN_CONFIG: Record<
  CheckoutPlan,
  { mode: "payment" | "subscription"; amountCents: number; name: string }
> = {
  lifetime: {
    mode: "payment",
    amountCents: 9900,
    name: "GramWise Lifetime",
  },
  monthly: {
    mode: "subscription",
    amountCents: 2900,
    name: "GramWise Monthly",
  },
};

function stripeSecretKey(): string | undefined {
  return process.env.STRIPE_SECRET_KEY?.trim();
}

/** Live keys blocked until STRIPE_ALLOW_LIVE=1 (legal entity required). */
export function isLiveStripeKey(key: string): boolean {
  return key.startsWith("sk_live_") || key.startsWith("rk_live_");
}

export function isStripeConfigured(): boolean {
  const key = stripeSecretKey();
  if (!key) return false;
  if (isLiveStripeKey(key) && process.env.STRIPE_ALLOW_LIVE !== "1") {
    return false;
  }
  return true;
}

export function getStripe(): Stripe {
  const key = stripeSecretKey();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (isLiveStripeKey(key) && process.env.STRIPE_ALLOW_LIVE !== "1") {
    throw new Error(
      "Live Stripe keys require STRIPE_ALLOW_LIVE=1 and a registered legal entity",
    );
  }
  return new Stripe(key);
}

export function getAppUrl(fallback?: string): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.VERCEL_URL?.trim();
  if (configured) {
    return configured.startsWith("http")
      ? configured.replace(/\/$/, "")
      : `https://${configured}`;
  }
  return fallback ?? "http://localhost:3000";
}

export function lineItemsForPlan(
  plan: CheckoutPlan,
): Stripe.Checkout.SessionCreateParams["line_items"] {
  const priceId =
    plan === "lifetime"
      ? process.env.STRIPE_PRICE_LIFETIME?.trim()
      : process.env.STRIPE_PRICE_MONTHLY?.trim();

  if (priceId) {
    return [{ price: priceId, quantity: 1 }];
  }

  const config = PLAN_CONFIG[plan];
  if (config.mode === "payment") {
    return [
      {
        price_data: {
          currency: "eur",
          product_data: { name: config.name },
          unit_amount: config.amountCents,
        },
        quantity: 1,
      },
    ];
  }

  return [
    {
      price_data: {
        currency: "eur",
        product_data: { name: config.name },
        unit_amount: config.amountCents,
        recurring: { interval: "month" },
      },
      quantity: 1,
    },
  ];
}

export function checkoutModeForPlan(plan: CheckoutPlan): "payment" | "subscription" {
  return PLAN_CONFIG[plan].mode;
}
