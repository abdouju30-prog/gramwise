import { describe, expect, it } from "vitest";
import { mergeSnapshots, type CloudSnapshotV1 } from "@/lib/cloud-sync";

function snap(
  partial: Partial<CloudSnapshotV1> & Pick<CloudSnapshotV1, "updatedAt">,
): CloudSnapshotV1 {
  return {
    version: 1,
    updatedAt: partial.updatedAt,
    wizard: partial.wizard ?? null,
    recipes: partial.recipes ?? [],
    catalog: partial.catalog ?? null,
  };
}

describe("mergeSnapshots", () => {
  it("keeps newest recipe by savedAt", () => {
    const local = snap({
      updatedAt: "2026-01-01T00:00:00Z",
      recipes: [
        {
          id: "a",
          ownerId: "u1",
          name: "Local",
          savedAt: "2026-01-02T00:00:00Z",
          recipe: {} as CloudSnapshotV1["recipes"][0]["recipe"],
        },
      ],
    });
    const remote = snap({
      updatedAt: "2026-01-03T00:00:00Z",
      recipes: [
        {
          id: "a",
          ownerId: "u1",
          name: "Remote old",
          savedAt: "2026-01-01T00:00:00Z",
          recipe: {} as CloudSnapshotV1["recipes"][0]["recipe"],
        },
      ],
    });
    const merged = mergeSnapshots(local, remote);
    expect(merged.recipes[0]?.name).toBe("Local");
  });
});
