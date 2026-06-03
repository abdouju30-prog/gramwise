import { describe, expect, it } from "vitest";
import { parseLaborPhases } from "@/lib/recipe";
import { effectiveLaborHourlyMad, parseSmigHourlyMad } from "@/lib/smic";

describe("parseSmigHourlyMad", () => {
  it("derives hourly from monthly SMIG and hours", () => {
    const hourly = parseSmigHourlyMad({
      smigMonthlyMad: "3119",
      smigHoursPerMonth: "191",
    });
    expect(hourly).not.toBeNull();
    expect(hourly!).toBeCloseTo(3119 / 191, 4);
  });
});

describe("effectiveLaborHourlyMad", () => {
  it("uses SMIG when rate empty", () => {
    expect(effectiveLaborHourlyMad(null, 16.33, false)).toBe(16.33);
  });

  it("floors owner labor at SMIG", () => {
    expect(effectiveLaborHourlyMad(10, 16.33, true)).toBe(16.33);
  });

  it("allows employee rate below SMIG", () => {
    expect(effectiveLaborHourlyMad(10, 16.33, false)).toBe(10);
  });
});

describe("parseLaborPhases with SMIG", () => {
  it("uses SMIG for hours without rate and ignores rate-only rows", () => {
    const phases = parseLaborPhases(
      [
        { id: "1", label: "Prep", hours: "0.5", hourlyRate: "" },
        { id: "2", label: "Bad", hours: "", hourlyRate: "20" },
      ],
      "MAD",
      { smigHourlyMad: 16.33, laborByOwner: false },
    );
    expect(phases).toEqual([{ hours: 0.5, hourlyRate: 16.33 }]);
  });

  it("works when session lacks smig fields", () => {
    const hourly = parseSmigHourlyMad({});
    expect(hourly).not.toBeNull();
  });
});
