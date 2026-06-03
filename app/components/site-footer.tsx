"use client";

import Link from "next/link";
import { useMessages } from "@/lib/i18n/locale-provider";

export function SiteFooter({ className = "" }: { className?: string }) {
  const m = useMessages();
  const contact = process.env.NEXT_PUBLIC_LEGAL_CONTACT_EMAIL?.trim();

  return (
    <footer className={`site-footer ${className}`.trim()}>
      <nav className="site-footer-nav" aria-label={m.legal.footerNavLabel}>
        <Link href="/legal/privacy">{m.legal.footerPrivacy}</Link>
        <Link href="/legal/terms">{m.legal.footerTerms}</Link>
        {contact ? (
          <a href={`mailto:${contact}`}>{m.legal.footerContact}</a>
        ) : null}
      </nav>
      <p className="site-footer-copy">{m.legal.footerCopy}</p>
    </footer>
  );
}
