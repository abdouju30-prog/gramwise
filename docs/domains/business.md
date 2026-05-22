# Domain: business

## Business model (draft)

| Option | Price | Notes |
|--------|-------|-------|
| **A** | €29 / month | Recurring, supportable |
| **B** | €99 lifetime | Faster cash, pastry IG audience |
| **C** | Freemium | 3 saves free → paywall |

Decision deferred until MVP works and is **accurate**.

## Success metrics

| Phase | Metric |
|-------|--------|
| Build | 10/10 test cases match reference Excel |
| Beta | 5 real bakers say “numbers match my reality” |
| GTM | CPA < 40% of first payment on Meta ads |
| Year 1 | €6k–40k gross (solo, realistic band) |

## Tech direction

- Web app: Next.js App Router + tested `engine/`
- Stripe Checkout: `POST /api/checkout` (lifetime €99 / monthly €29) — env in `.env.example`
- Webhook: `POST /api/webhooks/stripe` — logs completion; user access TBD with auth
- Deploy: Vercel + `NEXT_PUBLIC_APP_URL` — [DEPLOY_VERCEL.md](../DEPLOY_VERCEL.md)
- Beta Maroc: [BETA_CHECKLIST.md](../BETA_CHECKLIST.md) — 5 pâtissiers, calculator free, **Stripe test only**
- Stripe live: only after legal entity + beta sign-off; requires `STRIPE_ALLOW_LIVE=1` (code blocks `sk_live_` otherwise)
