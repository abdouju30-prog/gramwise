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
- [x] Gumroad checkout links on landing (no LTD required) — [docs/GUMROAD_SETUP.md](docs/GUMROAD_SETUP.md)
- [x] Stripe Checkout stub (optional; live blocked without `STRIPE_ALLOW_LIVE=1`)
- [ ] Stripe **live** — only after LTD if you outgrow Gumroad

## P2 — Launch

- [x] Landing page
- [x] Legal pages (privacy, terms, footer) — [docs/GLOBAL_LAUNCH.md](docs/GLOBAL_LAUNCH.md) step 1
- [x] Cloud account + sync (Supabase magic link) — [docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md) step 2
- [x] Gumroad checkout (€29 lifetime)
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
