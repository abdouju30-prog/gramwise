"use client";

import Link from "next/link";
import { Suspense } from "react";
import { LicenseUnlockForm } from "@/app/components/license-unlock-form";
import { useMessages } from "@/lib/i18n/locale-provider";

function UnlockContent() {
  const m = useMessages();
  return (
    <main>
      <p className="eyebrow">{m.unlock.eyebrow}</p>
      <h1>{m.unlock.title}</h1>
      <p className="lead">{m.unlock.lead}</p>
      <LicenseUnlockForm showTitle={false} />
      <p className="start-cta">
        <Link href="/#pricing" className="btn btn-ghost">
          {m.unlock.buyLink}
        </Link>
        <Link href="/" className="btn btn-ghost">
          {m.unlock.home}
        </Link>
      </p>
    </main>
  );
}

export default function UnlockPage() {
  return (
    <Suspense fallback={null}>
      <UnlockContent />
    </Suspense>
  );
}
