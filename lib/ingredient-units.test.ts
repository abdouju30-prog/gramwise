import { describe, expect, it } from "vitest";
import { convertQuantity, defaultPriceUnit, resolvePriceUnit } from "./ingredient-units";
import { parseIngredients, type IngredientRow } from "./recipe";

describe("ingredient unit conversion", () => {
  it("defaults purchase price unit to kg when quantity is g", () => {
    expect(defaultPriceUnit("g")).toBe("kg");
    expect(defaultPriceUnit("ml")).toBe("L");
    expect(defaultPriceUnit("kg")).toBe("kg");
  });

  it("converts g to kg and ml to L", () => {
    expect(convertQuantity(800, "g", "kg")).toBe(0.8);
    expect(convertQuantity(200, "ml", "L")).toBe(0.2);
    expect(convertQuantity(1, "kg", "g")).toBe(1000);
  });

  it("rejects cross-family conversion", () => {
    expect(convertQuantity(100, "g", "L")).toBeNull();
  });

  it("parseIngredients applies conversion for costing", () => {
    const rows: IngredientRow[] = [
      {
        id: "1",
        name: "Sucre",
        quantity: "800",
        quantityUnit: "g",
        costPerUnit: "11",
        priceUnit: "kg",
      },
    ];
    const parsed = parseIngredients(rows);
    expect(parsed).toEqual([{ quantity: 0.8, costPerUnit: 11 }]);
  });
});

describe("resolvePriceUnit", () => {
  it("keeps explicit bulk price unit", () => {
    expect(resolvePriceUnit("g", "kg")).toBe("kg");
  });

  it("ignores g/ml as price basis", () => {
    expect(resolvePriceUnit("g", "g")).toBe("kg");
    expect(resolvePriceUnit("ml", "ml")).toBe("L");
  });

  it("falls back when explicit unit is another family", () => {
    expect(resolvePriceUnit("g", "L")).toBe("kg");
  });
});

describe("parseIngredients with comma decimals", () => {
  it("parses European decimal prices", () => {
    const rows: IngredientRow[] = [
      {
        id: "1",
        name: "Glucose",
        quantity: "200",
        quantityUnit: "g",
        costPerUnit: "24,99",
        priceUnit: "kg",
      },
    ];
    const parsed = parseIngredients(rows);
    expect(parsed?.[0]?.quantity).toBe(0.2);
    expect(parsed?.[0]?.costPerUnit).toBeCloseTo(24.99, 2);
  });
});
