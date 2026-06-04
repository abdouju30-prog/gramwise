# Gumroad checkout (before LTD)

Gumroad acts as **seller of record** and holds payouts until you form a company (e.g. UK LTD) and optionally move to Stripe later.

## 1. GramWise Lifetime product page (dailytask.gumroad.com)

Product editor: `https://gumroad.com/products/zklavm/edit` · public URL: `https://dailytask.gumroad.com/l/gramwise-lifetime`

| Area | What to set |
|------|-------------|
| **Product** | Name `GramWise Lifetime` · Description (EN, features + €29 + activation) · Summary one line · CTA **Buy this** · Price **29 €** fixed (disable pay-what-you-want) |
| **Cover + Thumbnail** | Upload `docs/assets/gramwise-gumroad-cover.svg` (or export PNG 1280×720) on **Cover** and **Thumbnail** → **Save changes** |
| **Content** | Buyer instructions + **Insert → License key** (product ID `Skdqgmauk3Tiq5kwx0Sq9Q==` for API verify) |
| **Receipt** | Button `Activer GramWise` · message with `https://fixload.vercel.app/checkout/success` |
| **Share** | Optional Discover category/tags |

### Toggles (Product tab — Integrations / Pricing / Settings)

| Keep **OFF** (your screenshot is correct) | Keep **ON** |
|-------------------------------------------|-------------|
| Gumroad community chat, Circle, Discord | **Refund policy** (30 days) |
| Pay what you want, installments, auto discount | **E-publication for VAT** (digital) |
| Limit sales, quantity, shipping | |
| | **Content → Insert → License key** (required for GramWise gate) |

**Post-purchase URL:** Gumroad no longer exposes a per-product “redirect after purchase” field in the editor. Buyers land on the Gumroad library page; activation is via **Receipt** button + **Content** instructions linking to `https://fixload.vercel.app/checkout/success`.

## 2. Post-purchase activation (not a Gumroad redirect)

Set on **Receipt** (button `Activate GramWise`) and **Content** (buyer instructions + license key). Optional: first link in Content uses `?__sale_info__` if you need sale params on your site.

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

Redeploy. License gate is **off by default**. To lock the wizard after launch, set `GUMROAD_LICENSE_GATE=1` on Vercel (with token + product ID). Then:

- `/fixed-charges`, `/recipe`, `/results`, `/monthly-report`, `/start` require a verified license cookie.
- Buyers activate on `/checkout/success` or `/unlock` with the **license key** from the Gumroad email.
- API: `POST /api/gumroad/verify` → sets httpOnly cookie `gw_lic` for 1 year.

Without `GUMROAD_ACCESS_TOKEN` / product ID, the calculator stays open (links only).

## 5. Stripe

Stripe routes remain in the repo for a future LTD. If `NEXT_PUBLIC_GUMROAD_LIFETIME_URL` is set, Gumroad takes priority on the landing page.
