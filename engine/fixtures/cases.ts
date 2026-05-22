import type { CostingInput, CostingResult } from "../types.js";

export type ReferenceCase = {
  id: string;
  name: string;
  input: CostingInput;
  expected: Pick<
    CostingResult,
    | "directMaterials"
    | "directLabor"
    | "fixedLoadAllocated"
    | "fullCost"
    | "breakEvenPrice"
    | "recommendedPrice"
  > & {
    perUnit?: { breakEvenPrice: number; recommendedPrice: number };
    /** Case 07: must not equal markup-on-cost at same nominal rate */
    wrongIfMarkupOnCost?: number;
  };
};

const pct = (n: number) => n / 100;

/** Case 01 — Cupcakes */
const case01: ReferenceCase = {
  id: "01",
  name: "Cupcakes",
  input: {
    monthlyFixedCharges: 1100,
    capacity: { mode: "batches_per_month", batchesPerMonth: 40 },
    ingredients: [
      { quantity: 0.8, costPerUnit: 0.45 },
      { quantity: 0.6, costPerUnit: 0.65 },
      { quantity: 0.5, costPerUnit: 6.2 },
      { quantity: 6, costPerUnit: 0.28 },
      { quantity: 0.4, costPerUnit: 0.9 },
      { quantity: 0.05, costPerUnit: 3.0 },
    ],
    laborPhases: [
      { hours: 1.0, hourlyRate: 18 },
      { hours: 0.75, hourlyRate: 18 },
      { hours: 0.5, hourlyRate: 15 },
    ],
    wasteFraction: pct(3),
    marginFraction: pct(40),
  },
  expected: {
    directMaterials: 6.22,
    directLabor: 39.0,
    fixedLoadAllocated: 27.5,
    fullCost: 72.72,
    breakEvenPrice: 72.72,
    recommendedPrice: 121.2,
  },
};

/** Case 02 — Wedding cake */
const case02: ReferenceCase = {
  id: "02",
  name: "Wedding cake",
  input: {
    monthlyFixedCharges: 1200,
    capacity: { mode: "batches_per_month", batchesPerMonth: 8 },
    // Subtotal €104.49 per TEST_CASES (line costs rounded in reference sheet)
    ingredients: [{ quantity: 1, costPerUnit: 104.49 }],
    laborPhases: [
      { hours: 3, hourlyRate: 25 },
      { hours: 5, hourlyRate: 20 },
      { hours: 8, hourlyRate: 22 },
    ],
    wasteFraction: pct(10),
    marginFraction: pct(35),
  },
  expected: {
    directMaterials: 114.94,
    directLabor: 351.0,
    fixedLoadAllocated: 150.0,
    fullCost: 615.94,
    breakEvenPrice: 615.94,
    recommendedPrice: 947.6,
  },
};

/** Case 03 — Macarons (hourly capacity) */
const case03: ReferenceCase = {
  id: "03",
  name: "Macarons",
  input: {
    monthlyFixedCharges: 900,
    capacity: {
      mode: "hours_per_month",
      hoursPerMonth: 120,
      recipeTotalHours: 4.0,
    },
    ingredients: [
      { quantity: 0.5, costPerUnit: 12.0 },
      { quantity: 0.8, costPerUnit: 1.1 },
      { quantity: 0.35, costPerUnit: 0.65 },
      { quantity: 0.25, costPerUnit: 4.0 },
      { quantity: 0.005, costPerUnit: 20.0 },
      { quantity: 0.4, costPerUnit: 6.2 },
    ],
    // Total recipe labor: 4 h × €20 (see TEST_CASES.md Case 03)
    laborPhases: [{ hours: 4.0, hourlyRate: 20 }],
    wasteFraction: pct(12),
    marginFraction: pct(50),
  },
  expected: {
    directMaterials: 11.97,
    directLabor: 80.0,
    fixedLoadAllocated: 30.0,
    fullCost: 121.97,
    breakEvenPrice: 121.97,
    recommendedPrice: 243.94,
  },
};

/** Case 04 — Apple tart */
const case04: ReferenceCase = {
  id: "04",
  name: "Apple tart",
  input: {
    monthlyFixedCharges: 680,
    capacity: { mode: "batches_per_month", batchesPerMonth: 200 },
    ingredients: [
      { quantity: 0.15, costPerUnit: 0.45 },
      { quantity: 0.12, costPerUnit: 6.2 },
      { quantity: 0.08, costPerUnit: 0.65 },
      { quantity: 1, costPerUnit: 0.28 },
      { quantity: 0.6, costPerUnit: 2.5 },
      { quantity: 0.1, costPerUnit: 3.0 },
    ],
    laborPhases: [
      { hours: 0.4, hourlyRate: 18 },
      { hours: 0.35, hourlyRate: 18 },
    ],
    wasteFraction: pct(5),
    marginFraction: pct(45),
  },
  expected: {
    directMaterials: 3.09,
    directLabor: 13.5,
    fixedLoadAllocated: 3.4,
    fullCost: 19.99,
    breakEvenPrice: 19.99,
    recommendedPrice: 36.35,
  },
};

/** Case 05 — Zero fixed */
const case05: ReferenceCase = {
  id: "05",
  name: "Yule logs",
  input: {
    monthlyFixedCharges: 0,
    capacity: { mode: "batches_per_month", batchesPerMonth: 30 },
    ingredients: [
      { quantity: 1.0, costPerUnit: 0.45 },
      { quantity: 0.8, costPerUnit: 6.2 },
      { quantity: 0.5, costPerUnit: 0.65 },
      { quantity: 4, costPerUnit: 0.28 },
      { quantity: 0.5, costPerUnit: 10.0 },
    ],
    laborPhases: [{ hours: 2.0, hourlyRate: 16 }],
    wasteFraction: 0,
    marginFraction: pct(25),
  },
  expected: {
    directMaterials: 11.86,
    directLabor: 32.0,
    fixedLoadAllocated: 0.0,
    fullCost: 43.86,
    breakEvenPrice: 43.86,
    recommendedPrice: 58.48,
  },
};

/** Case 06 — Éclairs per piece */
const case06: ReferenceCase = {
  id: "06",
  name: "Éclairs",
  input: {
    monthlyFixedCharges: 950,
    capacity: { mode: "batches_per_month", batchesPerMonth: 50 },
    ingredients: [
      { quantity: 0.25, costPerUnit: 0.45 },
      { quantity: 0.35, costPerUnit: 6.2 },
      { quantity: 0.6, costPerUnit: 0.9 },
      { quantity: 4, costPerUnit: 0.28 },
      { quantity: 0.3, costPerUnit: 4.5 },
      { quantity: 0.2, costPerUnit: 11.0 },
    ],
    // 1.9 h × €18 = €34.20 (TEST_CASES.md Case 06)
    laborPhases: [{ hours: 1.9, hourlyRate: 18 }],
    wasteFraction: pct(4),
    marginFraction: pct(55),
    yieldCount: 12,
  },
  expected: {
    directMaterials: 7.79,
    directLabor: 34.2,
    fixedLoadAllocated: 19.0,
    fullCost: 60.99,
    breakEvenPrice: 60.99,
    recommendedPrice: 135.53,
    perUnit: { breakEvenPrice: 5.08, recommendedPrice: 11.29 },
  },
};

/** Case 07 — Anti-markup (same as 02, margin 20%) */
const case07: ReferenceCase = {
  id: "07",
  name: "Wedding cake low margin",
  input: { ...case02.input, marginFraction: pct(20) },
  expected: {
    directMaterials: 114.94,
    directLabor: 351.0,
    fixedLoadAllocated: 150.0,
    fullCost: 615.94,
    breakEvenPrice: 615.94,
    recommendedPrice: 769.93,
    wrongIfMarkupOnCost: 739.13,
  },
};

/** Case 08 — Cake slice */
const case08: ReferenceCase = {
  id: "08",
  name: "Cake slice",
  input: {
    monthlyFixedCharges: 520,
    capacity: { mode: "batches_per_month", batchesPerMonth: 100 },
    ingredients: [{ quantity: 1, costPerUnit: 8.5 }],
    laborPhases: [
      { hours: 2, hourlyRate: 17 },
      { hours: 1, hourlyRate: 18 },
      { hours: 0.5, hourlyRate: 15 },
    ],
    wasteFraction: pct(6),
    marginFraction: pct(30),
    yieldCount: 12,
  },
  expected: {
    directMaterials: 9.01,
    directLabor: 59.5,
    fixedLoadAllocated: 5.2,
    fullCost: 73.71,
    breakEvenPrice: 73.71,
    recommendedPrice: 105.3,
    perUnit: { breakEvenPrice: 6.14, recommendedPrice: 8.78 },
  },
};

/** Case 09 — Cookie batch */
const case09: ReferenceCase = {
  id: "09",
  name: "Cookies",
  input: {
    monthlyFixedCharges: 2000,
    capacity: { mode: "batches_per_month", batchesPerMonth: 80 },
    ingredients: [
      { quantity: 2.0, costPerUnit: 0.45 },
      { quantity: 1.5, costPerUnit: 6.2 },
      { quantity: 0.8, costPerUnit: 7.0 },
      { quantity: 1.0, costPerUnit: 0.65 },
      { quantity: 3, costPerUnit: 0.28 },
      { quantity: 0.01, costPerUnit: 80.0 },
    ],
    laborPhases: [{ hours: 1.5, hourlyRate: 19 }],
    wasteFraction: pct(2),
    marginFraction: pct(38),
  },
  expected: {
    directMaterials: 18.45,
    directLabor: 28.5,
    fixedLoadAllocated: 25.0,
    fullCost: 71.95,
    breakEvenPrice: 71.95,
    recommendedPrice: 116.05,
  },
};

/** Case 10 — 0% margin */
const case10: ReferenceCase = {
  id: "10",
  name: "Break-even only",
  input: {
    monthlyFixedCharges: 2400,
    capacity: { mode: "batches_per_month", batchesPerMonth: 1 },
    ingredients: [{ quantity: 1, costPerUnit: 42.0 }],
    laborPhases: [{ hours: 20, hourlyRate: 22 }],
    wasteFraction: pct(5),
    marginFraction: 0,
  },
  expected: {
    directMaterials: 44.1,
    directLabor: 440.0,
    fixedLoadAllocated: 2400.0,
    fullCost: 2884.1,
    breakEvenPrice: 2884.1,
    recommendedPrice: 2884.1,
  },
};

export const REFERENCE_CASES: ReferenceCase[] = [
  case01,
  case02,
  case03,
  case04,
  case05,
  case06,
  case07,
  case08,
  case09,
  case10,
];
