import { cookies } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import { LicenseUnlockForm } from "@/app/components/license-unlock-form";
import {
  DEFAULT_LOCALE,
  getMessages,
  isLocale,
  STORAGE_KEY,
} from "@/lib/i18n";
import { isGumroadLicenseGateEnabled } from "@/lib/gumroad-license";

export default async function CheckoutSuccessPage() {
  const gate = isGumroadLicenseGateEnabled();
  const cookieStore = await cookies();
  const stored = cookieStore.get(STORAGE_KEY)?.value;
  const locale = stored && isLocale(stored) ? stored : DEFAULT_LOCALE;
  const m = getMessages(locale).checkout;

  return (
    <main>
      <p className="eyebrow">{m.eyebrow}</p>
      <h1>{m.successTitle}</h1>
      <p className="lead">{gate ? m.successBody : m.successBodyOpen}</p>
      {gate && (
        <Suspense fallback={null}>
          <LicenseUnlockForm />
        </Suspense>
      )}
      <p className="start-cta">
        {gate && (
          <Link href="/unlock" className="btn btn-ghost">
            {m.unlockLater}
          </Link>
        )}
        <Link href="/start" className="btn btn-primary">
          {m.openCalculator}
        </Link>
        <Link href="/" className="btn btn-ghost">
          {m.home}
        </Link>
      </p>
    </main>
  );
}
