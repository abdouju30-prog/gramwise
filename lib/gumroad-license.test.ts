import { afterEach, describe, expect, it } from "vitest";
import {
  isGumroadLicenseGateEnabled,
  pathRequiresLicense,
} from "@/lib/gumroad-license";

describe("gumroad license gate", () => {
  const env = process.env;

  afterEach(() => {
    process.env = env;
  });

  it("pathRequiresLicense matches wizard routes", () => {
    expect(pathRequiresLicense("/recipe")).toBe(true);
    expect(pathRequiresLicense("/legal/privacy")).toBe(false);
    expect(pathRequiresLicense("/unlock")).toBe(false);
  });

  it("gate off without credentials", () => {
    delete process.env.GUMROAD_ACCESS_TOKEN;
    delete process.env.GUMROAD_LIFETIME_PRODUCT_ID;
    delete process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL;
    expect(isGumroadLicenseGateEnabled()).toBe(false);
  });

  it("gate on when gumroad URL and verify env set", () => {
    process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL =
      "https://seller.gumroad.com/l/test";
    process.env.GUMROAD_ACCESS_TOKEN = "tok";
    process.env.GUMROAD_LIFETIME_PRODUCT_ID = "id";
    expect(isGumroadLicenseGateEnabled()).toBe(true);
  });
});
