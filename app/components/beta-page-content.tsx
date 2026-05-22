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

export function BetaPageContent() {
  const m = useMessages();
  const { locale } = useLocale();
  const appUrl = getPublicAppUrl();
  const calculatorUrl = `${appUrl}/start`;
  const feedbackUrl = betaFeedbackUrl();
  const whatsappUrl = betaWhatsAppLink(
    defaultBetaFeedbackMessage(appUrl, locale),
  );

  return (
    <main className="beta-page">
      <p className="eyebrow">{m.beta.pageEyebrow}</p>
      <h1>{m.beta.pageTitle}</h1>
      <p className="lead">{m.beta.pageLead}</p>

      {!isPublicBeta() && <p className="tip-box">{m.beta.serverOff}</p>}

      <section className="card beta-block">
        <h2>{m.beta.step1Title}</h2>
        <p>
          <Link href="/start" className="brand-accent">
            {calculatorUrl}
          </Link>
        </p>
        <Link href="/fixed-charges" className="btn btn-primary">
          {m.beta.step1Cta}
        </Link>
      </section>

      <section className="card beta-block">
        <h2>{m.beta.step2Title}</h2>
        <ol className="beta-steps">
          {m.beta.step2Items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="card beta-block">
        <h2>{m.beta.step3Title}</h2>
        <p className="preview-caption">{m.beta.step3Body}</p>
        <div className="beta-actions">
          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {m.beta.whatsappCta}
            </a>
          ) : (
            <p className="preview-caption">{m.beta.whatsappMissing}</p>
          )}
          {feedbackUrl ? (
            <a
              href={feedbackUrl}
              className="btn btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              {m.beta.form}
            </a>
          ) : null}
        </div>
      </section>

      <p className="beta-foot">
        <Link href="/">{m.beta.footHome}</Link>
      </p>
    </main>
  );
}
