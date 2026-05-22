# Deploy — Vercel (GramWise)

## Prérequis

- Compte Vercel lié au repo GitHub `gramwise`
- CLI : `npm i -g vercel` (ou `npx vercel`)
- Build local OK : `npm run build`

## Premier déploiement

```bash
cd fixload   # repo GramWise
vercel link --yes
vercel deploy --prod --yes
```

Note l’URL de production (actuelle : `https://fixload.vercel.app`).

## Variable obligatoire

Dans **Vercel → Project → Settings → Environment Variables** (Production + Preview) :

| Variable | Exemple | Rôle |
|----------|---------|------|
| `NEXT_PUBLIC_APP_URL` | `https://fixload.vercel.app` | URLs de retour Stripe Checkout (sans slash final) |

Sans cette variable, `getAppUrl()` retombe sur `VERCEL_URL` (preview) — acceptable en preview, **pas** pour Stripe test en prod.

## Stripe (beta = test uniquement)

Configurer en **test mode** ([dashboard test](https://dashboard.stripe.com/test/apikeys)) :

| Variable | Notes |
|----------|--------|
| `STRIPE_SECRET_KEY` | `sk_test_...` only until legal entity |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` from test webhook endpoint |
| `STRIPE_PRICE_LIFETIME` / `STRIPE_PRICE_MONTHLY` | optional test Price IDs |

Webhook URL (test) : `https://<prod-domain>/api/webhooks/stripe` — events: `checkout.session.completed`.

**Do not** set `STRIPE_ALLOW_LIVE=1` or live keys before company registration.

## Vérification post-deploy

1. `GET /` — landing loads
2. `/start` → `/fixed-charges` → `/recipe` → `/results` — wizard OK
3. Si Stripe test configuré : bouton checkout → redirect Stripe test → `/checkout/success`
4. `npm test` — engine cases still green locally

## CLI — env prod

```bash
vercel env add NEXT_PUBLIC_APP_URL production
# paste https://your-prod-domain (no trailing slash)
```

Redeploy after env changes: `vercel deploy --prod --yes`.

## Push GitHub ≠ prod Vercel

`git push` on `main` **does not** refresh `https://fixload.vercel.app` unless the Vercel project is connected to GitHub.

After an important push (UI, API, session, i18n), run:

```bash
npx vercel deploy --prod --yes
```

Cursor agents follow `.cursor/rules/vercel-deploy-after-push.mdc` (auto after push when prod must match `main`).
