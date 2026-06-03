"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildShopCapacity, type FixedChargesForm } from "@/lib/fixed-charges";
import { formatFromMad } from "@/lib/currency";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import { parsePositive } from "@/lib/parse";
import {
  parseLaborPhases,
  recipeLaborHours,
  type RecipeForm,
} from "@/lib/recipe";

type Props = {
  fixed: FixedChargesForm;
  recipe: RecipeForm;
  monthlyTotal: number | null;
  fixedLoadAllocated: number | null;
};

export function RecipeFixedLoadPreview({
  fixed,
  recipe,
  monthlyTotal,
  fixedLoadAllocated,
}: Props) {
  const m = useMessages();
  const t = m.recipe.fixedLoadPreview;
  const { entryCurrency } = useLocale();

  const formula = useMemo(() => {
    if (monthlyTotal === null || fixedLoadAllocated === null) return null;

    if (fixed.capacityMode === "batches_per_month") {
      const batches = parsePositive(fixed.batchesPerMonth);
      if (batches === null) return null;
      return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${batches} ${t.batchesDenom} = ${formatFromMad(fixedLoadAllocated, entryCurrency)} ${m.fixed.previewPerBatch}`;
    }

    const shopHours = parsePositive(fixed.hoursPerMonth);
    const phases = laborPhases;
    const recipeHours = phases ? recipeLaborHours(phases) : null;
    if (shopHours === null || recipeHours === null || recipeHours === 0) return null;
    return `${formatFromMad(monthlyTotal, entryCurrency)} ÷ ${shopHours} h × ${recipeHours} h = ${formatFromMad(fixedLoadAllocated, entryCurrency)}`;
  }, [
    fixed,
    recipe.laborPhases,
    monthlyTotal,
    fixedLoadAllocated,
    entryCurrency,
    m.fixed.previewPerBatch,
    t.batchesDenom,
  ]);

  const laborPhases = useMemo(
    () => parseLaborPhases(recipe.laborPhases, entryCurrency),
    [recipe.laborPhases, entryCurrency],
  );

  const recipeHours = laborPhases ? recipeLaborHours(laborPhases) : null;

  const capacityOk = buildShopCapacity(
    fixed,
    fixed.capacityMode === "hours_per_month" ? recipeHours ?? undefined : undefined,
  );

  return (
    <div className="recipe-composer-section recipe-fixed-load-preview">
      <p className="recipe-section-label">{t.title}</p>
      <p className="field-hint field-hint-block">{t.hint}</p>

      {fixed.capacityMode === "batches_per_month" && fixedLoadAllocated !== null ? (
        <p className="recipe-fixed-load-value">
          {formatFromMad(fixedLoadAllocated, entryCurrency)}{" "}
          <span className="recipe-fixed-load-unit">{m.fixed.previewPerBatch}</span>
        </p>
      ) : null}

      {formula ? (
        <div className="capacity-example" aria-live="polite">
          <span className="capacity-example-label">{m.fixed.capacityExampleLabel}</span>
          <p className="capacity-example-formula">{formula}</p>
        </div>
      ) : null}

      {!capacityOk ? (
        <p className="preview-caption preview-error">{t.incomplete}</p>
      ) : null}

      <Link href="/fixed-charges" className="btn btn-ghost btn-sm">
        {t.editShop}
      </Link>
    </div>
  );
}
