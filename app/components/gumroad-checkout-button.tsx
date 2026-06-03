"use client";

import type { GumroadPlan } from "@/lib/gumroad";
import { gumroadProductUrl } from "@/lib/gumroad";

type Props = {
  plan: GumroadPlan;
  className?: string;
  children: React.ReactNode;
};

/** Opens Gumroad checkout (seller of record until you form an LTD). */
export function GumroadCheckoutButton({ plan, className, children }: Props) {
  const url = gumroadProductUrl(plan);
  if (!url) return null;

  return (
    <a
      href={url}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
