"use client";

import Link from "next/link";
import { useMessages } from "@/lib/i18n/locale-provider";

type DocKey = "privacy" | "terms";

export function LegalDocument({ doc }: { doc: DocKey }) {
  const m = useMessages();
  const content = m.legal[doc];

  return (
    <main className="legal-page">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p className="legal-updated">{content.updated}</p>
      <p className="lead legal-intro">{content.intro}</p>

      <div className="legal-sections">
        {content.sections.map((section) => (
          <section key={section.title} className="legal-section card">
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </section>
        ))}
      </div>

      <p className="legal-disclaimer">{m.legal.disclaimer}</p>

      <nav className="step-nav">
        <Link href="/" className="btn btn-ghost">
          {m.legal.backHome}
        </Link>
        <Link
          href={doc === "privacy" ? "/legal/terms" : "/legal/privacy"}
          className="btn btn-ghost"
        >
          {doc === "privacy" ? m.legal.footerTerms : m.legal.footerPrivacy}
        </Link>
      </nav>
    </main>
  );
}
