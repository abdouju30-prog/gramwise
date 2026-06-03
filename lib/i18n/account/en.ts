import type { Messages } from "../types";

export const accountEn: Messages["account"] = {
  navLabel: "Account",
  eyebrow: "Account",
  title: "Cloud backup",
  lead: "Sign in to access your charges, recipes, and catalog on every device.",
  notConfiguredTitle: "Cloud not configured",
  notConfiguredBody:
    "Set up a Supabase project and environment variables (see docs/SUPABASE_SETUP.md). Until then, data stays on this device only.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  sendLink: "Send magic link",
  linkSent: "Link sent — check your inbox (and spam).",
  signedInAs: "Signed in as",
  syncNow: "Sync now",
  syncing: "Syncing…",
  synced: "Synced",
  lastSync: "Last sync:",
  signOut: "Sign out",
  syncHint: "Changes auto-save to the cloud a few seconds after you edit.",
  errorGeneric: "Could not sync. Try again.",
};
