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
      <div className="results-layout">
        {costing ? (
          <>
            <section className="card card-dark hero-price">
              <p className="hero-label">Recommended selling price</p>
              <p className="hero-value">
                {formatMoney(costing.result.recommendedPrice)}
              </p>
              <p className="hero-sub">
                Break-even {formatMoney(costing.result.fullCost)} · {title}
              </p>
            </section>

            <section className="card">
              <h2>Cost breakdown</h2>
              <div className="breakdown-dl">
                <div className="breakdown-row">
                  <span className="breakdown-name">Direct materials</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.directMaterials)}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-name">Direct labor</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.directLabor)}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-name">Fixed load allocated</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.fixedLoadAllocated)}
                  </span>
                </div>
                <div className="breakdown-row breakdown-row--sep">
                  <span className="breakdown-name">Full cost (break-even)</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.fullCost)}
                  </span>
                </div>
              </div>
              <p className="preview-caption">
                Margin {session.recipe.marginPercent}% on selling price · waste{" "}
                {session.recipe.wastePercent}%
              </p>
              <div className="tip-box">
                <strong>How margin works</strong>
                Recommended price = full cost ÷ (1 − margin%). This is not
                markup-on-cost at the same percentage.
              </div>
            </section>
          </>
        ) : (
          <section className="card">
            <h2>{title}</h2>
            <p className="preview-caption preview-error">
              Could not calculate — check your inputs on previous steps.
            </p>
          </section>
        )}
      </div>

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
