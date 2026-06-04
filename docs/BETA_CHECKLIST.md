# Beta Maroc — 5 pâtissiers

**Objectif :** 5 professionnels confirment que les chiffres GramWise collent à leur réalité (charges fixes, matière, main-d’œuvre, prix conseillé).

**Périmètre beta :** calculateur gratuit · Stripe **test** (`sk_test_`) uniquement · pas de clés live tant qu’il n’y a pas d’entité légale.

**URL prod :** https://fixload.vercel.app/start · guide https://fixload.vercel.app/beta — [BETA_LAUNCH.md](./BETA_LAUNCH.md)

---

## Diffusion beta (canal actif)

- Guide a partager : https://fixload.vercel.app/beta
- Canal principal : WhatsApp (deja configure)
- Rappel perimetre : pas de Stripe live pendant cette phase

---

## Recrutement (5 profils)

| # | Profil cible | Contact / IG | Statut |
|---|--------------|--------------|--------|
| 1 | Pâtissier·ère maison, petits volumes | _nom · WA/IG_ — réseau perso, story page IG pâtisserie | À contacter |
| 2 | Labo gâteaux personnalisés (mariage) | _nom · WA/IG_ — DM IG (#mariage, labos gâteau perso.) | À contacter |
| 3 | Viennoiserie / production régulière | _nom · WA/IG_ — boulangeries-pâtisseries, reco locale | À contacter |
| 4 | Pâtisserie salon + commandes | _nom · WA/IG_ — commerces Casablanca/Rabat (salon + commandes) | À contacter |
| 5 | Micro-entreprise multi-produits | _nom · WA/IG_ — groupes FB artisans, multi-gamme | À contacter |

**Statuts (mettre à jour la colonne droite) :** À contacter → Message envoyé (`/beta`) → Test en cours → Retour reçu → Validé. Remplacer `_nom · WA/IG_` dès le premier échange.

---

## Pipeline beta (5 testeurs · retours chiffrés)

**Build de référence :** `0c6a4bf` · prod https://fixload.vercel.app · montants en **MAD** (ou devise saisie par le testeur).

**À copier depuis l’écran Résultats** (+ leur Excel / carnet pour la colonne « ref ») : charges fixes mensuelles, coût complet du lot testé, prix conseillé. **Δ prix** = `(Prix GW − Prix ref) / Prix ref × 100` (vide si pas de ref).

| # | Profil | Contact | Statut | CF mens. GW | CF mens. ref | Coût complet GW | Coût ref | Prix conseillé GW | Prix ref | Δ prix | Verdict |
|---|--------|---------|--------|-------------|--------------|-----------------|----------|-------------------|----------|--------|---------|
| 1 | Maison, petits volumes | _nom · WA/IG_ | À contacter | — | — | — | — | — | — | — | — |
| 2 | Labo mariage / perso. | _nom · WA/IG_ | À contacter | — | — | — | — | — | — | — | — |
| 3 | Viennoiserie / prod. régulière | _nom · WA/IG_ | À contacter | — | — | — | — | — | — | — | — |
| 4 | Salon + commandes | _nom · WA/IG_ | À contacter | — | — | — | — | — | — | — | — |
| 5 | Micro-entreprise multi-produits | _nom · WA/IG_ | À contacter | — | — | — | — | — | — | — | — |

**Synthèse pipeline :** 0/5 retours reçus · 0/5 verdict « collent » · 0/5 critères grille OK (voir ci-dessous) · sortie beta : **≥ 4/5** « collent ».

**Verdict (colonne droite) :** `Collent` · `Écart` (+ note 1 ligne dans issue ou WA) · `—` tant que pas de test.

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
