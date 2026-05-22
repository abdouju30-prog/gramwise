# Solution beta — 3 actions (fondateur)

Pas besoin de société ni de Stripe live pour lancer la beta.

## 1. URL à partager

**Calculateur :** https://fixload.vercel.app/start  
**Guide testeurs :** https://fixload.vercel.app/beta

## 2. Recruter 5 pâtissiers (WhatsApp / IG)

Message type :

```
Salut [prénom], je teste un calculateur de coût pour pâtissiers (charges fixes + recette + prix conseillé).
15 min, gratuit : https://fixload.vercel.app/beta
Après ton test, un retour WhatsApp ou vocal — « ça colle à tes chiffres ou pas ».
Merci !
```

Suivi : [BETA_CHECKLIST.md](./BETA_CHECKLIST.md) (tableau 5 lignes).

## 3. Variables Vercel (optionnel mais recommandé)

| Variable | Exemple | Effet |
|----------|---------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://fixload.vercel.app` | ✅ déjà fait |
| `NEXT_PUBLIC_BETA_MODE` | `1` | Bandeau beta + page guide |
| `NEXT_PUBLIC_BETA_WHATSAPP` | `2126XXXXXXXX` | Bouton retour WhatsApp |
| `NEXT_PUBLIC_BETA_FEEDBACK_URL` | lien Google Form | Formulaire structuré |

**Ne pas** ajouter `sk_live_`. Stripe test (`sk_test_`) seulement si tu veux tester le bouton paiement — pas requis pour la beta.

## Sortie beta → paiement

1. ≥ 4/5 testeurs : « les chiffres collent »
2. Création entité légale
3. Stripe live + `STRIPE_ALLOW_LIVE=1` + redeploy
