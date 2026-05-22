# Beta Maroc — 5 pâtissiers

**Objectif :** 5 professionnels confirment que les chiffres GramWise collent à leur réalité (charges fixes, matière, main-d’œuvre, prix conseillé).

**Périmètre beta :** calculateur gratuit · Stripe **test** (`sk_test_`) uniquement · pas de clés live tant qu’il n’y a pas d’entité légale.

**URL prod :** https://fixload.vercel.app (`NEXT_PUBLIC_APP_URL` configuré — [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)).

---

## Recrutement (5 profils)

| # | Profil cible | Contact / IG | Statut |
|---|--------------|--------------|--------|
| 1 | Pâtissier·ère maison, petits volumes | | ☐ |
| 2 | Labo gâteaux personnalisés (mariage) | | ☐ |
| 3 | Viennoiserie / production régulière | | ☐ |
| 4 | Pâtisserie salon + commandes | | ☐ |
| 5 | Micro-entreprise multi-produits | | ☐ |

---

## Parcours testeur (15–25 min)

1. Ouvrir l’URL prod → **Commencer** (`/start`).
2. **Charges fixes** : saisir loyer, énergie, assurance, abonnements, divers + capacité mensuelle (lots ou heures).
3. **Recette** : une recette réelle du testeur (ingrédients + temps + marge visée).
4. **Résultats** : noter coût complet, seuil, prix conseillé.
5. Comparer avec **Excel / carnet / facture** habituelle du testeur.

---

## Grille de validation (par testeur)

| Critère | OK | KO | Notes |
|---------|----|----|-------|
| Charges fixes mensuelles réalistes | ☐ | ☐ | |
| Répartition fixe (lot/heure) compréhensible | ☐ | ☐ | |
| Matière + perte ≈ leur calcul | ☐ | ☐ | |
| Main-d’œuvre ≈ leur calcul | ☐ | ☐ | |
| Prix conseillé « dans le bon ordre de grandeur » | ☐ | ☐ | |
| Interface utilisable sans formation | ☐ | ☐ | |

**Verdict testeur :** ☐ « Les chiffres collent » · ☐ « Écart à corriger » (décrire en 2 lignes)

---

## Critère de sortie beta

- **≥ 4 / 5** verdicts « collent » sur les 5 critères métier ci-dessus.
- Écarts documentés dans un fichier ou issue (formule, unité, arrondi).
- **Ensuite seulement :** création société → Stripe live (`sk_live_`) + `STRIPE_ALLOW_LIVE=1` (voir `.env.example`).

---

## Stripe pendant la beta

| Autorisé | Interdit |
|----------|----------|
| `sk_test_` / `pk_test_` | `sk_live_` / `pk_live_` |
| Checkout test (cartes [4242…](https://docs.stripe.com/testing)) | Encaissement réel |
| Webhook endpoint test (`whsec_` test) | Live mode sans entité |
