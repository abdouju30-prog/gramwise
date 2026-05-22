import { describe, it, expect } from "vitest";
import {
  calculateCosting,
  priceIfMarkupOnCost,
} from "./calculate.js";
import { REFERENCE_CASES } from "./fixtures/cases.js";

const TOLERANCE = 0.01;

function expectMoney(actual: number, expected: number) {
  const diff = Math.abs(roundToCents(actual) - roundToCents(expected));
  expect(diff).toBeLessThanOrEqual(TOLERANCE);
}

function roundToCents(n: number): number {
  return Math.round(n * 100) / 100;
}

describe("GramWise costing engine — 10 reference cases", () => {
  for (const ref of REFERENCE_CASES) {
    describe(`Case ${ref.id} — ${ref.name}`, () => {
      const result = calculateCosting(ref.input);

      it("direct_materials", () => {
        expectMoney(result.directMaterials, ref.expected.directMaterials);
      });

      it("direct_labor", () => {
        expectMoney(result.directLabor, ref.expected.directLabor);
      });

      it("fixed_load_allocated", () => {
        expectMoney(
          result.fixedLoadAllocated,
          ref.expected.fixedLoadAllocated,
        );
      });

      it("full_cost", () => {
        expectMoney(result.fullCost, ref.expected.fullCost);
      });

      it("break_even_price", () => {
        expectMoney(result.breakEvenPrice, ref.expected.breakEvenPrice);
      });

      it("recommended_price (margin on selling price)", () => {
        expectMoney(
          result.recommendedPrice,
          ref.expected.recommendedPrice,
        );
      });

      if (ref.expected.perUnit) {
        it("per-unit break_even and recommended", () => {
          expect(result.perUnit).toBeDefined();
          expectMoney(
            result.perUnit!.breakEvenPrice,
            ref.expected.perUnit!.breakEvenPrice,
          );
          expectMoney(
            result.perUnit!.recommendedPrice,
            ref.expected.perUnit!.recommendedPrice,
          );
        });
      }

      if (ref.expected.wrongIfMarkupOnCost != null) {
        it("must not use markup-on-cost at same nominal rate", () => {
          const wrong = priceIfMarkupOnCost(
            ref.expected.fullCost,
            ref.input.marginFraction,
          );
          expectMoney(wrong, ref.expected.wrongIfMarkupOnCost);
          expect(result.recommendedPrice).not.toBe(wrong);
        });
      }
    });
  }
});

describe("edge cases", () => {
  it("zero monthly fixed does not throw", () => {
    const c = REFERENCE_CASES.find((r) => r.id === "05")!;
    expect(() => calculateCosting(c.input)).not.toThrow();
  });

  it("0% margin: recommended equals break-even", () => {
    const c = REFERENCE_CASES.find((r) => r.id === "10")!;
    const r = calculateCosting(c.input);
    expect(r.recommendedPrice).toBe(r.breakEvenPrice);
  });
});
