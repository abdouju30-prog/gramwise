"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BetaFeedbackCard } from "@/app/components/beta-feedback-card";
import { runCosting } from "@/lib/costing";
import { formatMoney } from "@/lib/format";
import { interpolate } from "@/lib/i18n/format";
import { useMessages } from "@/lib/i18n/locale-provider";
import { useWizardGuard } from "@/lib/use-wizard-guard";

function toCsvCell(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function toCsvLine(values: string[]): string {
  return values.map(toCsvCell).join(",");
}

function toHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function ResultsView() {
  const m = useMessages();
  const session = useWizardGuard("recipe");

  const costing = useMemo(() => {
    if (!session?.fixedCharges || !session.recipe) return null;
    return runCosting(session.fixedCharges, session.recipe);
  }, [session]);

  if (!session?.recipe) return null;
  const recipe = session.recipe;

  const title =
    recipe.name.trim() || m.results.defaultRecipeName;
  const ingredientNames = recipe.ingredients
    .filter(
      (row) =>
        (row.name?.trim() ?? "") !== "" || row.quantity.trim() !== "" || row.costPerUnit.trim() !== "",
    )
    .map((row, index) =>
      (row.name?.trim() ?? "") !== ""
        ? (row.name?.trim() ?? "")
        : `${m.results.ingredientUnnamed} ${index + 1}`,
    );
  const ingredientRows = recipe.ingredients
    .filter(
      (row) =>
        (row.name?.trim() ?? "") !== "" || row.quantity.trim() !== "" || row.costPerUnit.trim() !== "",
    )
    .map((row, index) => {
      const quantity = Number.parseFloat(row.quantity) || 0;
      const costPerUnit = Number.parseFloat(row.costPerUnit) || 0;
      return {
        name:
          (row.name?.trim() ?? "") !== ""
            ? (row.name?.trim() ?? "")
            : `${m.results.ingredientUnnamed} ${index + 1}`,
        quantity,
        costPerUnit,
        total: quantity * costPerUnit,
      };
    });
  const laborRows = recipe.laborPhases
    .filter(
      (row) => row.label.trim() !== "" || row.hours.trim() !== "" || row.hourlyRate.trim() !== "",
    )
    .map((row, index) => {
      const hours = Number.parseFloat(row.hours) || 0;
      const hourlyRate = Number.parseFloat(row.hourlyRate) || 0;
      return {
        name:
          row.label.trim() !== "" ? row.label.trim() : `${m.recipe.phase} ${index + 1}`,
        hours,
        hourlyRate,
        total: hours * hourlyRate,
      };
    });

  function handleExportCsv() {
    if (!costing) return;
    const lines = [
      toCsvLine(["Recipe", title]),
      toCsvLine(["GeneratedAt", new Date().toISOString()]),
      "",
      toCsvLine(["Summary", "Value"]),
      toCsvLine(["RecommendedPrice", costing.result.recommendedPrice.toFixed(2)]),
      toCsvLine(["BreakEven", costing.result.fullCost.toFixed(2)]),
      toCsvLine(["DirectMaterials", costing.result.directMaterials.toFixed(2)]),
      toCsvLine(["DirectLabor", costing.result.directLabor.toFixed(2)]),
      toCsvLine(["FixedLoad", costing.result.fixedLoadAllocated.toFixed(2)]),
      "",
      toCsvLine(["Ingredients", "Quantity", "CostPerUnit", "LineTotal"]),
      ...ingredientRows.map((row) =>
        toCsvLine([
          row.name,
          row.quantity.toString(),
          row.costPerUnit.toString(),
          row.total.toFixed(2),
        ]),
      ),
      "",
      toCsvLine(["Labor", "Hours", "HourlyRate", "LineTotal"]),
      ...laborRows.map((row) =>
        toCsvLine([
          row.name,
          row.hours.toString(),
          row.hourlyRate.toString(),
          row.total.toFixed(2),
        ]),
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeTitle = title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-+|-+$/g, "");
    a.href = url;
    a.download = `gramwise-${safeTitle || "recipe"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    if (!costing) return;
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) return;
    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${toHtml(title)} - GramWise</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 24px; color: #2c1a0e; }
      h1, h2 { margin: 0 0 12px; }
      h1 { font-size: 24px; }
      h2 { font-size: 18px; margin-top: 24px; }
      p { margin: 6px 0; }
      table { border-collapse: collapse; width: 100%; margin-top: 8px; }
      th, td { border: 1px solid #d6c9b0; padding: 8px; text-align: left; font-size: 13px; }
      th { background: #f5f0e8; }
    </style>
  </head>
  <body>
    <h1>${toHtml(title)}</h1>
    <p><strong>${toHtml(m.results.recommendedPrice)}:</strong> ${toHtml(formatMoney(costing.result.recommendedPrice))}</p>
    <p><strong>${toHtml(m.results.fullCostBreakEven)}:</strong> ${toHtml(formatMoney(costing.result.fullCost))}</p>
    <p><strong>${toHtml(m.results.marginWaste)}:</strong> ${toHtml(
      interpolate(m.results.marginWaste, {
        margin: recipe.marginPercent,
        waste: recipe.wastePercent,
      }),
    )}</p>
    <h2>${toHtml(m.results.ingredientNamesTitle)}</h2>
    <table>
      <thead>
        <tr>
          <th>${toHtml(m.recipe.ingredientName)}</th>
          <th>${toHtml(m.recipe.qty)}</th>
          <th>${toHtml(m.recipe.costPerUnit)}</th>
          <th>${toHtml(m.results.directMaterials)}</th>
        </tr>
      </thead>
      <tbody>
        ${ingredientRows
          .map(
            (row) =>
              `<tr><td>${toHtml(row.name)}</td><td>${row.quantity}</td><td>${row.costPerUnit}</td><td>${toHtml(
                formatMoney(row.total),
              )}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
    <h2>${toHtml(m.recipe.laborLegend)}</h2>
    <table>
      <thead>
        <tr>
          <th>${toHtml(m.recipe.phase)}</th>
          <th>${toHtml(m.recipe.hours)}</th>
          <th>${toHtml(m.recipe.ratePerHour)}</th>
          <th>${toHtml(m.results.directLabor)}</th>
        </tr>
      </thead>
      <tbody>
        ${laborRows
          .map(
            (row) =>
              `<tr><td>${toHtml(row.name)}</td><td>${row.hours}</td><td>${row.hourlyRate}</td><td>${toHtml(
                formatMoney(row.total),
              )}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </body>
</html>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

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
              {ingredientNames.length > 0 ? (
                <div className="tip-box">
                  <strong>{m.results.ingredientNamesTitle}</strong>
                  <ul>
                    {ingredientNames.map((name, index) => (
                      <li key={`${name}-${index}`}>{name}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="preview-caption">
                {interpolate(m.results.marginWaste, {
                  margin: recipe.marginPercent,
                  waste: recipe.wastePercent,
                })}
              </p>
              <div className="tip-box">
                <strong>{m.results.marginTipTitle}</strong>
                {m.results.marginTipBody}
              </div>
              <div className="results-export-actions">
                <span className="field-label">{m.results.exportTitle}</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleExportCsv}
                >
                  {m.results.exportCsv}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleExportPdf}
                >
                  {m.results.exportPdf}
                </button>
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
