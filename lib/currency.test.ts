import { describe, expect, it } from "vitest";
import { convertFromMad, formatFromMad } from "./currency";

describe("currency", () => {
  it("converts MAD to EUR and USD with default rates", () => {
    expect(convertFromMad(108.5, "EUR")).toBeCloseTo(10, 2);
    expect(convertFromMad(100, "USD")).toBeCloseTo(10, 2);
    expect(convertFromMad(50, "MAD")).toBe(50);
  });

  it("formats MAD amounts in target currency", () => {
    expect(formatFromMad(100, "MAD")).toContain("100");
    expect(formatFromMad(100, "EUR")).toMatch(/€|EUR/);
    expect(formatFromMad(100, "USD")).toMatch(/\$|USD/);
  });
});
