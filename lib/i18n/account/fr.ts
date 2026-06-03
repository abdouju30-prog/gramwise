import type { Messages } from "../types";

export const accountFr: Messages["account"] = {
  navLabel: "Compte",
  eyebrow: "Compte",
  title: "Sauvegarde cloud",
  lead: "Connectez-vous pour retrouver charges, recettes et catalogue sur tous vos appareils.",
  notConfiguredTitle: "Cloud non configuré",
  notConfiguredBody:
    "L’administrateur doit créer un projet Supabase et ajouter les variables d’environnement (voir docs/SUPABASE_SETUP.md). En attendant, vos données restent sur cet appareil.",
  emailLabel: "E-mail",
  emailPlaceholder: "vous@exemple.com",
  sendLink: "Recevoir le lien magique",
  linkSent: "Lien envoyé — vérifiez votre boîte mail (et les spams).",
  signedInAs: "Connecté :",
  syncNow: "Synchroniser maintenant",
  syncing: "Synchronisation…",
  synced: "Synchronisé",
  lastSync: "Dernière sync :",
  signOut: "Se déconnecter",
  syncHint:
    "Les modifications sont sauvegardées automatiquement dans le cloud toutes les quelques secondes après connexion.",
  errorGeneric: "Impossible de synchroniser. Réessayez.",
};
