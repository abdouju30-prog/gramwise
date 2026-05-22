"use client";

import Link from "next/link";
import {
  betaFeedbackUrl,
  betaWhatsAppLink,
  defaultBetaFeedbackMessage,
  getPublicAppUrl,
  isPublicBeta,
} from "@/lib/beta";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";

export function BetaFeedbackCard() {
  const m = useMessages();
  const { locale } = useLocale();
  if (!isPublicBeta()) return null;

  const appUrl = getPublicAppUrl();
  const whatsappUrl = betaWhatsAppLink(
    defaultBetaFeedbackMessage(appUrl, locale),
  );
  const formUrl = betaFeedbackUrl();

  return (
    <section className="card beta-feedback-card">
      <h2>{m.beta.feedbackTitle}</h2>
      <p className="preview-caption">{m.beta.feedbackBody}</p>
      <div className="beta-actions">
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            className="btn btn-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {m.beta.whatsappSend}
          </a>
        ) : (
          <Link href="/beta" className="btn btn-primary">
            {m.beta.guideLink}
          </Link>
        )}
        {formUrl ? (
          <a
            href={formUrl}
            className="btn btn-ghost"
            target="_blank"
            rel="noopener noreferrer"
          >
            {m.beta.form}
          </a>
        ) : null}
      </div>
    </section>
  );
}
