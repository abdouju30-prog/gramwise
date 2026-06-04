import {
  gumroadLifetimeProductId,
  isGumroadVerifySuccess,
  type GumroadVerifyPayload,
} from "@/lib/gumroad-license";

export type VerifyLicenseResult =
  | { ok: true }
  | { ok: false; code: "not_configured" | "invalid" | "upstream" };

export async function verifyGumroadLicenseKey(
  licenseKey: string,
): Promise<VerifyLicenseResult> {
  const token = process.env.GUMROAD_ACCESS_TOKEN?.trim();
  const productId = gumroadLifetimeProductId();
  if (!token || !productId) {
    return { ok: false, code: "not_configured" };
  }

  const key = licenseKey.trim();
  if (!key || key.length > 500) {
    return { ok: false, code: "invalid" };
  }

  const body = new URLSearchParams({
    product_id: productId,
    license_key: key,
    increment_uses_count: "false",
  });

  let res: Response;
  try {
    res = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      cache: "no-store",
    });
  } catch {
    return { ok: false, code: "upstream" };
  }

  let payload: GumroadVerifyPayload;
  try {
    payload = (await res.json()) as GumroadVerifyPayload;
  } catch {
    return { ok: false, code: "upstream" };
  }

  if (!res.ok || !isGumroadVerifySuccess(payload)) {
    return { ok: false, code: "invalid" };
  }

  return { ok: true };
}
