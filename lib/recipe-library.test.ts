import { describe, expect, it, beforeEach } from "vitest";
import {
  loadRecipeLibrary,
  saveRecipeToLibrary,
  type SavedRecipe,
} from "./recipe-library";
import { DEFAULT_RECIPE } from "./recipe";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, "window", {
    value: globalThis,
    configurable: true,
  });
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    },
    configurable: true,
  });
  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => `id-${Math.random().toString(36).slice(2, 9)}`,
    },
    configurable: true,
  });
});

function setOwner(id: string) {
  storage.set("gramwise-recipe-owner-v1", id);
}

function seedLibrary(entries: SavedRecipe[]) {
  storage.set("gramwise-recipe-library-v2", JSON.stringify(entries));
}

describe("recipe library multi-owner", () => {
  it("does not erase another owner's recipes when the second user loads", () => {
    const ownerA = "owner-a";
    const ownerB = "owner-b";

    seedLibrary([
      {
        id: "r1",
        ownerId: ownerA,
        name: "Caramel beurre salé",
        savedAt: new Date().toISOString(),
        recipe: DEFAULT_RECIPE,
      },
    ]);

    setOwner(ownerB);
    expect(loadRecipeLibrary()).toHaveLength(0);

    setOwner(ownerA);
    const list = loadRecipeLibrary();
    expect(list).toHaveLength(1);
    expect(list[0]?.name).toBe("Caramel beurre salé");
  });

  it("keeps both owners after each saves", () => {
    setOwner("owner-a");
    saveRecipeToLibrary({ ...DEFAULT_RECIPE, name: "Recette A" });

    setOwner("owner-b");
    saveRecipeToLibrary({ ...DEFAULT_RECIPE, name: "Recette B" });

    setOwner("owner-a");
    expect(loadRecipeLibrary().map((r) => r.name)).toContain("Recette A");

    setOwner("owner-b");
    expect(loadRecipeLibrary().map((r) => r.name)).toContain("Recette B");

    const raw = JSON.parse(
      storage.get("gramwise-recipe-library-v2") ?? "[]",
    ) as SavedRecipe[];
    expect(raw).toHaveLength(2);
  });
});
