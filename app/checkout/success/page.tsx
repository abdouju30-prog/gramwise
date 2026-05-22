"use client";

import Link from "next/link";
import { useMessages } from "@/lib/i18n/locale-provider";

export default function CheckoutSuccessPage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.checkout.eyebrow}</p>
      <h1>{m.checkout.successTitle}</h1>
      <p className="lead">{m.checkout.successBody}</p>
      <p className="start-cta">
        <Link href="/start" className="btn btn-primary">
          {m.checkout.openCalculator}
        </Link>
        <Link href="/" className="btn btn-ghost">
          {m.checkout.home}
        </Link>
      </p>
    </main>
  );
}
