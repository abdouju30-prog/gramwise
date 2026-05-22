import Link from "next/link";
import {
  betaFeedbackUrl,
  betaWhatsAppLink,
  defaultBetaFeedbackMessage,
  getPublicAppUrl,
  isPublicBeta,
} from "@/lib/beta";

export function BetaFeedbackCard() {
  if (!isPublicBeta()) return null;

  const appUrl = getPublicAppUrl();
  const whatsappUrl = betaWhatsAppLink(defaultBetaFeedbackMessage(appUrl));
  const formUrl = betaFeedbackUrl();

  return (
    <section className="card beta-feedback-card">
      <h2>Beta — vos chiffres collent ?</h2>
      <p className="preview-caption">
        Comparez ce résultat à votre Excel ou carnet. Un retour de 2 minutes
        aide à valider l’outil avant ouverture payante.
      </p>
      <div className="beta-actions">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Envoyer mon retour (WhatsApp)
          </a>
        ) : (
          <Link href="/beta" className="btn btn-primary">
            Voir le guide beta
          </Link>
        )}
        {formUrl ? (
          <a
            href={formUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            Formulaire
          </a>
        ) : null}
      </div>
    </section>
  );
}
