import { describe, expect, it } from "vitest";
import { parseIngredientText } from "./ingredient-import";

describe("parseIngredientText", () => {
  it("parses CSV-style lines", () => {
    const rows = parseIngredientText(
      "Farine;0.5;kg;4.5\nSucre;0.3;kg;6\nLait;1;L;9",
    );
    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      name: "Farine",
      quantity: "0.5",
      quantityUnit: "kg",
      costPerUnit: "4.5",
    });
    expect(rows[2]?.quantityUnit).toBe("L");
  });

  it("parses freeform with embedded units", () => {
    const rows = parseIngredientText("500 g farine\n2 L lait");
    expect(rows[0]?.name.toLowerCase()).toContain("farine");
    expect(rows[0]?.quantity).toBe("500");
    expect(rows[0]?.quantityUnit).toBe("g");
    expect(rows[1]?.quantityUnit).toBe("L");
  });

  it("parses leading quantity", () => {
    const rows = parseIngredientText("0.8 kg beurre");
    expect(rows[0]).toMatchObject({
      name: "beurre",
      quantity: "0.8",
      quantityUnit: "kg",
    });
  });
});
