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

## Tech direction (not implemented yet)

- Web app (SPA or Next.js) — **calculation module isolated and unit-tested**
- No “magic” LLM in the pricing path
- Deploy: Vercel or similar
- Auth/payments: phase 2 (Stripe after accuracy proven)
