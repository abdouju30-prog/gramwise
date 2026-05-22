import { NextResponse } from "next/server";
import {
  checkoutModeForPlan,
  getAppUrl,
  getStripe,
  isStripeConfigured,
  lineItemsForPlan,
  type CheckoutPlan,
} from "@/lib/stripe";

const VALID_PLANS: CheckoutPlan[] = ["lifetime", "monthly"];

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not configured yet." },
      { status: 503 },
    );
  }

  let plan: CheckoutPlan;
  try {
    const body = (await request.json()) as { plan?: string };
    if (!body.plan || !VALID_PLANS.includes(body.plan as CheckoutPlan)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }
    plan = body.plan as CheckoutPlan;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const origin = request.headers.get("origin");
    const appUrl = getAppUrl(origin ?? undefined);

    const session = await stripe.checkout.sessions.create({
      mode: checkoutModeForPlan(plan),
      line_items: lineItemsForPlan(plan),
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancel`,
      allow_promotion_codes: true,
      metadata: { plan },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
