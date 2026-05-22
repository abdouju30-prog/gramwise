# GramWise — TODO

## P0 — Foundation

- [x] `docs/TEST_CASES.md` — 10 pastry reference cases (Excel-validated)
- [x] `docs/FORMULAS.md` — margin vs markup, units, edge cases
- [x] Choose stack + init app skeleton (Next.js App Router + `engine/`)
- [x] `engine/` module + tests (all cases green)

## P1 — MVP UI

- [x] Fixed charges + capacity screen
- [x] Recipe screen (pastry preset)
- [x] Results + breakdown screen
- [x] Basic professional UI (no generic AI aesthetic)

## P0 — Beta Maroc (before company / Stripe live)

- [x] Deploy Vercel prod + `NEXT_PUBLIC_APP_URL=https://fixload.vercel.app` — [docs/DEPLOY_VERCEL.md](docs/DEPLOY_VERCEL.md)
- [ ] Beta: 5 pâtissiers valident chiffres — [docs/BETA_CHECKLIST.md](docs/BETA_CHECKLIST.md)
- [x] Stripe Checkout stub (test keys only; live blocked without `STRIPE_ALLOW_LIVE=1`)
- [ ] Stripe **live** — only after legal entity + beta sign-off (not before)

## P2 — Launch

- [x] Landing page
- [x] Stripe or lifetime payment (Checkout API + webhook stub)
- [ ] Link from Instagram pastry page
- [ ] Meta ads creatives (founder)

## P3 — Expand

- [x] FR + AR locale (header switcher FR · ع · EN, RTL for Arabic)
- [ ] Second preset (soap or farm)
- [ ] Export PDF quote

## Future

- Multi-user workspaces
- Accounting integrations
