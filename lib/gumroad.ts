export type GumroadPlan = "lifetime" | "monthly";

/** Full Gumroad product URL, e.g. https://yourname.gumroad.com/l/gramwise-lifetime */
export function gumroadProductUrl(plan: GumroadPlan): string | null {
  const raw =
    plan === "lifetime"
      ? process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL
      : process.env.NEXT_PUBLIC_GUMROAD_MONTHLY_URL;
  const url = raw?.trim();
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export function isGumroadConfigured(): boolean {
  return gumroadProductUrl("lifetime") !== null;
}

export function isGumroadMonthlyConfigured(): boolean {
  return gumroadProductUrl("monthly") !== null;
}

export function isPaymentsEnabled(): boolean {
  return isGumroadConfigured();
}
