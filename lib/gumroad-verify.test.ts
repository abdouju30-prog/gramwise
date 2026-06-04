import { afterEach, describe, expect, it, vi } from "vitest";
import { isGumroadVerifySuccess } from "@/lib/gumroad-license";
import { verifyGumroadLicenseKey } from "@/lib/gumroad-verify";

describe("gumroad verify", () => {
  const env = process.env;

  afterEach(() => {
    process.env = env;
    vi.unstubAllGlobals();
  });

  it("isGumroadVerifySuccess rejects refunded", () => {
    expect(
      isGumroadVerifySuccess({
        success: true,
        purchase: { refunded: true },
      }),
    ).toBe(false);
  });

  it("returns not_configured without env", async () => {
    delete process.env.GUMROAD_ACCESS_TOKEN;
    delete process.env.GUMROAD_LIFETIME_PRODUCT_ID;
    const result = await verifyGumroadLicenseKey("KEY-1");
    expect(result).toEqual({ ok: false, code: "not_configured" });
  });

  it("accepts valid Gumroad response", async () => {
    process.env.GUMROAD_ACCESS_TOKEN = "test-token";
    process.env.GUMROAD_LIFETIME_PRODUCT_ID = "prod_abc";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, purchase: { refunded: false } }),
      }),
    );
    const result = await verifyGumroadLicenseKey("VALID-KEY");
    expect(result).toEqual({ ok: true });
  });

  it("rejects invalid Gumroad response", async () => {
    process.env.GUMROAD_ACCESS_TOKEN = "test-token";
    process.env.GUMROAD_LIFETIME_PRODUCT_ID = "prod_abc";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false, message: "nope" }),
      }),
    );
    const result = await verifyGumroadLicenseKey("BAD-KEY");
    expect(result).toEqual({ ok: false, code: "invalid" });
  });
});
