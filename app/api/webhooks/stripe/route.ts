import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Webhook secret not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(body, signature, secret);

    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      // TODO: persist customer access (user id, email) when auth exists
      console.info("[stripe] checkout completed", {
        sessionId: session.id,
        plan: session.metadata?.plan,
        customerEmail: session.customer_details?.email,
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
