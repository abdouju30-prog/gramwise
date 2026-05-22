import Link from "next/link";
import {
  betaFeedbackUrl,
  betaWhatsAppLink,
  defaultBetaFeedbackMessage,
  getPublicAppUrl,
  isPublicBeta,
} from "@/lib/beta";

export const metadata = {
  title: "GramWise — Beta testeurs",
  description: "Guide beta pour pâtissiers — valider les chiffres de costing.",
};

export default function BetaPage() {
  const appUrl = getPublicAppUrl();
  const calculatorUrl = `${appUrl}/start`;
  const feedbackUrl = betaFeedbackUrl();
  const whatsappUrl = betaWhatsAppLink(
    defaultBetaFeedbackMessage(appUrl),
  );

  return (
    <main className="beta-page">
      <p className="eyebrow">Beta Maroc</p>
      <h1>Testeurs pâtisserie (5 places)</h1>
      <p className="lead">
        Objectif : vérifier que les coûts et le prix conseillé correspondent à
        votre réalité (Excel, carnet, factures). Calculateur{" "}
        <strong>gratuit</strong> — pas de paiement pendant la beta.
      </p>

      {!isPublicBeta() && (
        <p className="tip-box">
          Mode beta désactivé côté serveur — ce guide reste valable pour les
          tests manuels.
        </p>
      )}

      <section className="card beta-block">
        <h2>1. Ouvrir l’outil</h2>
        <p>
          <Link href="/start" className="brand-accent">
            {calculatorUrl}
          </Link>
        </p>
        <Link href="/fixed-charges" className="btn btn-primary">
          Commencer — charges fixes
        </Link>
      </section>

      <section className="card beta-block">
        <h2>2. Parcours (15–25 min)</h2>
        <ol className="beta-steps">
          <li>Charges fixes du mois + capacité (lots ou heures)</li>
          <li>Une vraie recette : ingrédients, temps, marge, perte</li>
          <li>Résultats : comparer au prix que vous facturez aujourd’hui</li>
        </ol>
      </section>

      <section className="card beta-block">
        <h2>3. Envoyer votre retour</h2>
        <p className="preview-caption">
          Critère de succès : « les chiffres collent » sur matière, main-d’œuvre,
          charges fixes et ordre de grandeur du prix conseillé.
        </p>
        <div className="beta-actions">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Retour via WhatsApp
            </a>
          ) : (
            <p className="preview-caption">
              Fondateur : définir <code>NEXT_PUBLIC_BETA_WHATSAPP</code> sur
              Vercel (ex. 2126…).
            </p>
          )}
          {feedbackUrl ? (
            <a
              href={feedbackUrl}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Formulaire Google
            </a>
          ) : null}
        </div>
      </section>

      <p className="beta-foot">
        <Link href="/">Accueil</Link> · Checklist équipe :{" "}
        <code>docs/BETA_CHECKLIST.md</code>
      </p>
    </main>
  );
}
