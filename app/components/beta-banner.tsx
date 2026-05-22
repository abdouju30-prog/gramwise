import Link from "next/link";
import { isPublicBeta } from "@/lib/beta";

export function BetaBanner() {
  if (!isPublicBeta()) return null;

  return (
    <aside className="beta-banner" role="status">
      <p>
        <strong>Beta gratuite</strong> — testez le calculateur, comparez à vos
        chiffres habituels.
      </p>
      <Link href="/beta" className="beta-banner-link">
        Guide testeur →
      </Link>
    </aside>
  );
}
