import { isGumroadConfigured } from "@/lib/gumroad";

export const LICENSE_COOKIE_NAME = "gw_lic";

/** Wizard + report routes that require a verified Gumroad license when gate is on. */
export const LICENSE_GATED_PREFIXES = [
  "/start",
  "/fixed-charges",
  "/recipe",
  "/results",
  "/monthly-report",
] as const;

export function gumroadLifetimeProductId(): string | null {
  const id = process.env.GUMROAD_LIFETIME_PRODUCT_ID?.trim();
  return id || null;
}

/** Gate calculator when Gumroad is live and server verify credentials exist. */
export function isGumroadLicenseGateEnabled(): boolean {
  if (process.env.GUMROAD_LICENSE_GATE?.trim() === "0") return false;
  if (!isGumroadConfigured()) return false;
  const token = process.env.GUMROAD_ACCESS_TOKEN?.trim();
  const productId = gumroadLifetimeProductId();
  return Boolean(token && productId);
}

export function pathRequiresLicense(pathname: string): boolean {
  return LICENSE_GATED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function hasLicenseCookie(cookieValue: string | undefined): boolean {
  return cookieValue === "1";
}

export type GumroadVerifyPayload = {
  success?: boolean;
  message?: string;
  purchase?: {
    refunded?: boolean;
    subscription_cancelled_at?: string | null;
    subscription_ended_at?: string | null;
  };
};

export function isGumroadVerifySuccess(payload: GumroadVerifyPayload): boolean {
  if (!payload.success) return false;
  const purchase = payload.purchase;
  if (!purchase) return true;
  if (purchase.refunded) return false;
  if (purchase.subscription_cancelled_at) return false;
  if (purchase.subscription_ended_at) return false;
  return true;
}
