import { runCosting } from "@/lib/costing";
import type { DisplayCurrency } from "@/lib/currency";
import { monthlyFixedTotal, type FixedChargesForm } from "@/lib/fixed-charges";
import { parsePositive } from "@/lib/parse";
import type { SavedRecipe } from "@/lib/recipe-library";
import {
  parseLaborPhases,
  recipeLaborHours,
  type ProductionCountUnit,
  type RecipeForm,
} from "@/lib/recipe";
import { smigLaborOptionsFromFixed } from "@/lib/smic";

export type MonthlyReportRowStatus = "ok" | "incomplete";

export type MonthlyVolumeKind = "batches" | "preparations" | "runs";

export type MonthlyReportRow = {
  recipeId: string;
  name: string;
  status: MonthlyReportRowStatus;
  monthlyVolume: number | null;
  volumeKind: MonthlyVolumeKind;
  unitMaterials: number | null;
  unitLabor: number | null;
  monthlyMaterials: number | null;
  monthlyLabor: number | null;
  fixedShare: number | null;
  monthlyTotal: number | null;
};

export type MonthlyReport = {
  fixedChargesMonthly: number | null;
  rows: MonthlyReportRow[];
  sumMaterials: number;
  sumLabor: number;
  sumFixedAllocated: number;
  grandTotal: number | null;
  completeCount: number;
  incompleteCount: number;
};

function volumeKindFor(recipe: RecipeForm): MonthlyVolumeKind {
  if (recipe.capacityMode === "hours_per_month") return "runs";
  return recipe.productionCountUnit === "preparations"
    ? "preparations"
    : "batches";
}

export function recipeMonthlyVolume(
  recipe: RecipeForm,
  fixed: FixedChargesForm,
  entryCurrency: DisplayCurrency = "MAD",
): number | null {
  const smig = smigLaborOptionsFromFixed(
    fixed,
    recipe.laborByOwner,
    entryCurrency,
  );

  if (recipe.capacityMode === "batches_per_month") {
    return parsePositive(recipe.batchesPerMonth);
  }

  const shopHours = parsePositive(recipe.hoursPerMonth);
  const phases = parseLaborPhases(recipe.laborPhases, entryCurrency, smig);
  const recipeHours = phases ? recipeLaborHours(phases) : null;
  if (shopHours === null || recipeHours === null || recipeHours <= 0) {
    return null;
  }
  return shopHours / recipeHours;
}

type DraftRow = {
  saved: SavedRecipe;
  costing: NonNullable<ReturnType<typeof runCosting>>;
  volume: number;
  volumeKind: MonthlyVolumeKind;
};

export function buildMonthlyReport(
  fixed: FixedChargesForm,
  recipes: SavedRecipe[],
  entryCurrency: DisplayCurrency = "MAD",
): MonthlyReport {
  const fixedChargesMonthly = monthlyFixedTotal(
    fixed.chargeLines,
    entryCurrency,
  );

  const empty: MonthlyReport = {
    fixedChargesMonthly,
    rows: [],
    sumMaterials: 0,
    sumLabor: 0,
    sumFixedAllocated: 0,
    grandTotal: fixedChargesMonthly,
    completeCount: 0,
    incompleteCount: 0,
  };

  if (fixedChargesMonthly === null) return empty;

  const drafts: DraftRow[] = [];
  const incomplete: MonthlyReportRow[] = [];

  for (const saved of recipes) {
    const name = saved.name.trim() || saved.recipe.name.trim() || "—";
    const volumeKind = volumeKindFor(saved.recipe);
    const costing = runCosting(fixed, saved.recipe, entryCurrency);
    const volume = recipeMonthlyVolume(saved.recipe, fixed, entryCurrency);

    if (costing === null || volume === null) {
      incomplete.push({
        recipeId: saved.id,
        name,
        status: "incomplete",
        monthlyVolume: volume,
        volumeKind,
        unitMaterials: costing?.result.directMaterials ?? null,
        unitLabor: costing?.result.directLabor ?? null,
        monthlyMaterials: null,
        monthlyLabor: null,
        fixedShare: null,
        monthlyTotal: null,
      });
      continue;
    }

    drafts.push({ saved, costing, volume, volumeKind });
  }

  const totalVolume = drafts.reduce((s, d) => s + d.volume, 0);

  const okRows: MonthlyReportRow[] = drafts.map((d) => {
    const unitMaterials = d.costing.result.directMaterials;
    const unitLabor = d.costing.result.directLabor;
    const monthlyMaterials = unitMaterials * d.volume;
    const monthlyLabor = unitLabor * d.volume;
    const fixedShare =
      totalVolume > 0
        ? (fixedChargesMonthly * d.volume) / totalVolume
        : 0;
    const monthlyTotal = monthlyMaterials + monthlyLabor + fixedShare;

    return {
      recipeId: d.saved.id,
      name: d.saved.name.trim() || d.saved.recipe.name.trim() || "—",
      status: "ok",
      monthlyVolume: d.volume,
      volumeKind: d.volumeKind,
      unitMaterials,
      unitLabor,
      monthlyMaterials,
      monthlyLabor,
      fixedShare,
      monthlyTotal,
    };
  });

  const sumMaterials = okRows.reduce((s, r) => s + (r.monthlyMaterials ?? 0), 0);
  const sumLabor = okRows.reduce((s, r) => s + (r.monthlyLabor ?? 0), 0);
  const sumFixedAllocated = okRows.reduce((s, r) => s + (r.fixedShare ?? 0), 0);

  const variableSum = sumMaterials + sumLabor;
  const grandTotal =
    okRows.length > 0
      ? variableSum + sumFixedAllocated
      : fixedChargesMonthly;

  return {
    fixedChargesMonthly,
    rows: [...okRows, ...incomplete],
    sumMaterials,
    sumLabor,
    sumFixedAllocated,
    grandTotal,
    completeCount: okRows.length,
    incompleteCount: incomplete.length,
  };
}
