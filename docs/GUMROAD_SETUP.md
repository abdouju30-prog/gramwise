# Gumroad checkout (before LTD)

Gumroad acts as **seller of record** and holds payouts until you form a company (e.g. UK LTD) and optionally move to Stripe later.

## 1. Create products on Gumroad

1. [Gumroad](https://gumroad.com) → **Products** → **New product**.
2. **Lifetime** — one-time **€29**. Type: digital / license.
3. **Monthly** (optional, not shown on site) — skip unless you add a tier later.
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

## 4. License verification (step 3)

Add on **Vercel Production** (server-only — never expose the token in the client):

```env
GUMROAD_ACCESS_TOKEN=...          # Gumroad → Settings → Advanced → Access token
GUMROAD_LIFETIME_PRODUCT_ID=...   # Product page → ID in URL or API (not the /l/ slug)
# GUMROAD_LICENSE_GATE=0          # optional: disable gate while testing
```

Redeploy. When the lifetime URL **and** the two vars above are set:

- `/fixed-charges`, `/recipe`, `/results`, `/monthly-report`, `/start` require a verified license cookie.
- Buyers activate on `/checkout/success` or `/unlock` with the **license key** from the Gumroad email.
- API: `POST /api/gumroad/verify` → sets httpOnly cookie `gw_lic` for 1 year.

Without `GUMROAD_ACCESS_TOKEN` / product ID, the calculator stays open (links only).

## 5. Stripe

Stripe routes remain in the repo for a future LTD. If `NEXT_PUBLIC_GUMROAD_LIFETIME_URL` is set, Gumroad takes priority on the landing page.
