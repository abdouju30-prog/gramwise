export type IngredientLine = {
  quantity: number;
  costPerUnit: number;
};

export type LaborPhase = {
  hours: number;
  hourlyRate: number;
};

export type BatchCapacity = {
  mode: "batches_per_month";
  batchesPerMonth: number;
};

export type HourlyCapacity = {
  mode: "hours_per_month";
  hoursPerMonth: number;
  recipeTotalHours: number;
};

export type Capacity = BatchCapacity | HourlyCapacity;

export type CostingInput = {
  monthlyFixedCharges: number;
  capacity: Capacity;
  ingredients: IngredientLine[];
  laborPhases: LaborPhase[];
  /** Decimal fraction, e.g. 0.03 for 3% */
  wasteFraction: number;
  /** Decimal fraction on selling price, e.g. 0.40 for 40% */
  marginFraction: number;
  /** When priced per piece/slice, divide batch prices by this (default 1) */
  yieldCount?: number;
};

export type CostingResult = {
  directMaterials: number;
  directLabor: number;
  fixedLoadAllocated: number;
  fullCost: number;
  breakEvenPrice: number;
  recommendedPrice: number;
  /** Present when yieldCount > 1 and per-unit pricing applies */
  perUnit?: {
    breakEvenPrice: number;
    recommendedPrice: number;
  };
};
