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

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
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
