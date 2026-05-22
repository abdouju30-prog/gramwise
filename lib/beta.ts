import { isStripeConfigured } from "@/lib/stripe";

/** Public beta: free calculator, no live Stripe, collect tester feedback. */
export function isPublicBeta(): boolean {
  const mode = process.env.NEXT_PUBLIC_BETA_MODE?.trim();
  if (mode === "0") return false;
  if (mode === "1") return true;
  return !isStripeConfigured();
}

export function getPublicAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.startsWith("http")
      ? configured.replace(/\/$/, "")
      : `https://${configured.replace(/\/$/, "")}`;
  }
  return "https://fixload.vercel.app";
}

export function betaFeedbackUrl(): string | undefined {
  const url = process.env.NEXT_PUBLIC_BETA_FEEDBACK_URL?.trim();
  return url || undefined;
}

/** E.164 without +, e.g. 212612345678 for Morocco */
export function betaWhatsAppPhone(): string | undefined {
  const phone = process.env.NEXT_PUBLIC_BETA_WHATSAPP?.trim();
  if (!phone) return undefined;
  const digits = phone.replace(/\D/g, "");
  return digits || undefined;
}

export function betaWhatsAppLink(message: string): string | undefined {
  const digits = betaWhatsAppPhone();
  if (!digits) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function defaultBetaFeedbackMessage(appUrl: string): string {
  return [
    "Salut — test GramWise (beta pâtisserie).",
    `Lien: ${appUrl}/start`,
    "Après mon test: les chiffres collent ☐ Oui ☐ Non",
    "Écart (1 phrase): ",
    "Recette testée: ",
  ].join("\n");
}
