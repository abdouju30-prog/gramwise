"use client";

import Link from "next/link";
import { useMessages } from "@/lib/i18n/locale-provider";

export default function CheckoutCancelPage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.checkout.eyebrow}</p>
      <h1>{m.checkout.cancelTitle}</h1>
      <p className="lead">{m.checkout.cancelBody}</p>
      <p className="start-cta">
        <Link href="/#pricing" className="btn btn-primary">
          {m.checkout.viewPricing}
        </Link>
        <Link href="/start" className="btn btn-ghost">
          {m.checkout.openCalculator}
        </Link>
      </p>
    </main>
  );
}
