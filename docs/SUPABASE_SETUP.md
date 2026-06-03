# Supabase — compte + sync cloud (étape 2)

## 1. Créer le projet

1. [supabase.com](https://supabase.com) → **New project** (gratuit suffit pour démarrer).
2. **Authentication** → **Providers** → **Email** : activer **Magic Link** / OTP.
3. **Authentication** → **URL Configuration** :
   - Site URL : `https://fixload.vercel.app`
   - Redirect URLs : `https://fixload.vercel.app/account` · `http://localhost:3000/account`

## 2. Base de données

Dans **SQL Editor**, exécuter :

`supabase/migrations/001_user_snapshots.sql`

## 3. Variables Vercel (Production + Preview)

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

(Settings → API → Project URL + anon public key)

Redéployer après ajout.

## 4. Test

1. `/account` → saisir e-mail → lien magique.
2. Modifier une recette sur appareil A → attendre ~2 s.
3. Se connecter même e-mail sur appareil B → données fusionnées.

## Contenu synchronisé

- Session wizard (charges fixes + recette en cours)
- Bibliothèque recettes enregistrées
- Catalogue ingrédients (prix d’achat)

Sans Supabase configuré : comportement local inchangé.
