import { describe, expect, it } from "vitest";
import { parseDecimalString, parsePositive } from "./parse";

describe("parseDecimalString", () => {
  it("parses comma decimals", () => {
    expect(parseDecimalString("24,99")).toBe(24.99);
    expect(parseDecimalString("11")).toBe(11);
  });
});

describe("parsePositive", () => {
  it("accepts comma-separated positive numbers", () => {
    expect(parsePositive("24,99")).toBe(24.99);
  });
});
