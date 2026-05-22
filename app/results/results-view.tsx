"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BetaFeedbackCard } from "@/app/components/beta-feedback-card";
import { runCosting } from "@/lib/costing";
import { formatMoney } from "@/lib/format";
import { interpolate } from "@/lib/i18n/format";
import { useMessages } from "@/lib/i18n/locale-provider";
import { useWizardGuard } from "@/lib/use-wizard-guard";

export function ResultsView() {
  const m = useMessages();
  const session = useWizardGuard("recipe");

  const costing = useMemo(() => {
    if (!session?.fixedCharges || !session.recipe) return null;
    return runCosting(session.fixedCharges, session.recipe);
  }, [session]);

  if (!session?.recipe) return null;

  const title =
    session.recipe.name.trim() || m.results.defaultRecipeName;

  return (
    <>
      <div className="results-layout">
        {costing ? (
          <>
            <section className="card card-dark hero-price">
              <p className="hero-label">{m.results.recommendedPrice}</p>
              <p className="hero-value">
                {formatMoney(costing.result.recommendedPrice)}
              </p>
              <p className="hero-sub">
                {m.results.breakEvenSub}{" "}
                {formatMoney(costing.result.fullCost)} · {title}
              </p>
            </section>

            <section className="card">
              <h2>{m.results.breakdownTitle}</h2>
              <div className="breakdown-dl">
                <div className="breakdown-row">
                  <span className="breakdown-name">
                    {m.results.directMaterials}
                  </span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.directMaterials)}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-name">{m.results.directLabor}</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.directLabor)}
                  </span>
                </div>
                <div className="breakdown-row">
                  <span className="breakdown-name">{m.results.fixedLoad}</span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.fixedLoadAllocated)}
                  </span>
                </div>
                <div className="breakdown-row breakdown-row--sep">
                  <span className="breakdown-name">
                    {m.results.fullCostBreakEven}
                  </span>
                  <span className="breakdown-val">
                    {formatMoney(costing.result.fullCost)}
                  </span>
                </div>
              </div>
              <p className="preview-caption">
                {interpolate(m.results.marginWaste, {
                  margin: session.recipe.marginPercent,
                  waste: session.recipe.wastePercent,
                })}
              </p>
              <div className="tip-box">
                <strong>{m.results.marginTipTitle}</strong>
                {m.results.marginTipBody}
              </div>
            </section>
          </>
        ) : (
          <section className="card">
            <h2>{title}</h2>
            <p className="preview-caption preview-error">
              {m.results.calcError}
            </p>
          </section>
        )}
      </div>

      <BetaFeedbackCard />

      <nav className="step-nav">
        <Link href="/recipe" className="btn btn-ghost">
          {m.results.editRecipe}
        </Link>
        <Link href="/fixed-charges" className="btn btn-ghost">
          {m.results.editFixed}
        </Link>
      </nav>
    </>
  );
}
