import { describe, expect, it, afterEach } from "vitest";
import {
  gumroadProductUrl,
  isGumroadConfigured,
  isGumroadMonthlyConfigured,
} from "@/lib/gumroad";

describe("gumroad", () => {
  const env = process.env;

  afterEach(() => {
    process.env = env;
  });

  it("returns null when URL missing", () => {
    delete process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL;
    expect(isGumroadConfigured()).toBe(false);
  });

  it("accepts https product URLs", () => {
    process.env.NEXT_PUBLIC_GUMROAD_LIFETIME_URL =
      "https://seller.gumroad.com/l/test-lifetime";
    process.env.NEXT_PUBLIC_GUMROAD_MONTHLY_URL =
      "https://seller.gumroad.com/l/test-monthly";
    expect(gumroadProductUrl("lifetime")).toContain("gumroad.com");
    expect(isGumroadMonthlyConfigured()).toBe(true);
  });
});
