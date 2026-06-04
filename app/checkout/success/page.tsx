"use client";

import Link from "next/link";
import { Suspense } from "react";
import { LicenseUnlockForm } from "@/app/components/license-unlock-form";
import { useMessages } from "@/lib/i18n/locale-provider";

export default function CheckoutSuccessPage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.checkout.eyebrow}</p>
      <h1>{m.checkout.successTitle}</h1>
      <p className="lead">{m.checkout.successBody}</p>
      <Suspense fallback={null}>
        <LicenseUnlockForm />
      </Suspense>
      <p className="start-cta">
        <Link href="/unlock" className="btn btn-ghost">
          {m.checkout.unlockLater}
        </Link>
        <Link href="/" className="btn btn-ghost">
          {m.checkout.home}
        </Link>
      </p>
    </main>
  );
}
