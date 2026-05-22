"use client";

import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";

export function BetaBanner() {
  const m = useMessages();
  if (!isPublicBeta()) return null;

  return (
    <aside className="beta-banner" role="status">
      <p>
        <strong>{m.beta.bannerStrong}</strong> {m.beta.bannerText}
      </p>
      <Link href="/beta" className="beta-banner-link">
        {m.beta.bannerLink}
      </Link>
    </aside>
  );
}
