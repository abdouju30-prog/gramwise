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

  it("strips OCR label noise and keeps ingredient name", () => {
    const rows = parseIngredientText("IngrédientQuantitéSucre 500 g 6");
    expect(rows.some((r) => /sucre/i.test(r.name))).toBe(true);
    const sucre = rows.find((r) => /sucre/i.test(r.name));
    expect(sucre?.quantity).toBe("500");
    expect(sucre?.quantityUnit).toBe("g");
  });

  it("parses name-first messy lines", () => {
    const rows = parseIngredientText("Caramel 2 kg 15\nbeurre 200 g 12");
    expect(rows[0]?.name.toLowerCase()).toMatch(/caramel/);
    expect(rows[0]?.quantity).toBe("2");
    expect(rows[1]?.name.toLowerCase()).toMatch(/beurre/);
  });
});
