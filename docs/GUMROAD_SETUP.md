# Gumroad checkout (before LTD)

Gumroad acts as **seller of record** and holds payouts until you form a company (e.g. UK LTD) and optionally move to Stripe later.

## 1. Create products on Gumroad

1. [Gumroad](https://gumroad.com) → **Products** → **New product**.
2. **Lifetime** — one-time price (e.g. €99). Type: digital / license.
3. **Monthly** (optional) — enable **Membership** with monthly billing (e.g. €29/mo).
4. Copy each product **URL** (Share link).

## 2. Redirect after purchase

In each product → **Settings** → after purchase:

- **Custom redirect URL**: `https://fixload.vercel.app/checkout/success`

## 3. Environment variables (Vercel Production)

```env
NEXT_PUBLIC_GUMROAD_LIFETIME_URL=https://YOURNAME.gumroad.com/l/gramwise-lifetime
NEXT_PUBLIC_GUMROAD_MONTHLY_URL=https://YOURNAME.gumroad.com/l/gramwise-monthly
```

Redeploy after saving. The landing **Pricing** section shows Gumroad buttons; beta-only pricing hides automatically when the lifetime URL is set.

## 4. Calculator access today

- Checkout does **not** gate the app yet (no license verification).
- Buyers use the calculator immediately; keep purchase emails for support.
- **Later**: Gumroad license API or user accounts when you add LTD + Stripe.

## 5. Stripe

Stripe routes remain in the repo for a future LTD. If `NEXT_PUBLIC_GUMROAD_LIFETIME_URL` is set, Gumroad takes priority on the landing page.
