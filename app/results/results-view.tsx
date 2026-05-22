"use client";

import Link from "next/link";
import { useMemo } from "react";
import { runCosting } from "@/lib/costing";
import { formatMoney } from "@/lib/format";
import { useWizardGuard } from "@/lib/use-wizard-guard";

export function ResultsView() {
  const session = useWizardGuard("recipe");

  const costing = useMemo(() => {
    if (!session?.fixedCharges || !session.recipe) return null;
    return runCosting(session.fixedCharges, session.recipe);
  }, [session]);

  if (!session?.recipe) return null;

  const title = session.recipe.name.trim() || "Your recipe";

  return (
    <>
      <section className="card">
        <h2>{title}</h2>
        {costing ? (
          <>
            <dl className="breakdown-dl">
              <dt>Direct materials</dt>
              <dd>{formatMoney(costing.result.directMaterials)}</dd>
              <dt>Direct labor</dt>
              <dd>{formatMoney(costing.result.directLabor)}</dd>
              <dt>Fixed load allocated</dt>
              <dd>{formatMoney(costing.result.fixedLoadAllocated)}</dd>
              <dt className="breakdown-sep">Full cost (break-even)</dt>
              <dd className="breakdown-sep">
                {formatMoney(costing.result.fullCost)}
              </dd>
              <dt className="breakdown-highlight">
                Recommended price
              </dt>
              <dd className="breakdown-highlight">
                {formatMoney(costing.result.recommendedPrice)}
              </dd>
            </dl>
            <p className="preview-caption">
              Margin {session.recipe.marginPercent}% on selling price · waste{" "}
              {session.recipe.wastePercent}%
            </p>
          </>
        ) : (
          <p className="preview-caption preview-error">
            Could not calculate — check your inputs on previous steps.
          </p>
        )}
      </section>

      <nav className="step-nav">
        <Link href="/recipe" className="btn btn-ghost">
          Edit recipe
        </Link>
        <Link href="/fixed-charges" className="btn btn-ghost">
          Edit fixed charges
        </Link>
      </nav>
    </>
  );
}
