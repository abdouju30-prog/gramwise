"use client";

import Link from "next/link";
import { useMemo } from "react";
import { buildMonthlyReport, type MonthlyVolumeKind } from "@/lib/monthly-report";
import { loadRecipeLibrary } from "@/lib/recipe-library";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import { loadWizardSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FixedChargesForm } from "@/lib/fixed-charges";
import { normalizeFixedChargesForm } from "@/lib/fixed-charges";

function volumeLabel(
  kind: MonthlyVolumeKind,
  r: ReturnType<typeof useMessages>["monthlyReport"],
): string {
  switch (kind) {
    case "preparations":
      return r.volumePreparations;
    case "runs":
      return r.volumeRuns;
    default:
      return r.volumeBatches;
  }
}

export function MonthlyReportView() {
  const m = useMessages();
  const r = m.monthlyReport;
  const { formatMoney, entryCurrency } = useLocale();
  const router = useRouter();
  const [fixed, setFixed] = useState<FixedChargesForm | null>(null);
  const [libraryTick, setLibraryTick] = useState(0);

  useEffect(() => {
    const session = loadWizardSession();
    if (!session?.fixedCharges) {
      router.replace("/fixed-charges");
      return;
    }
    setFixed(normalizeFixedChargesForm(session.fixedCharges));
  }, [router]);

  const report = useMemo(() => {
    if (!fixed) return null;
    const recipes = loadRecipeLibrary();
    return buildMonthlyReport(fixed, recipes, entryCurrency);
  }, [fixed, entryCurrency, libraryTick]);

  useEffect(() => {
    setLibraryTick((n) => n + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith("gramwise-recipe-library")) {
        setLibraryTick((n) => n + 1);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleExportCsv() {
    if (!report) return;
    const lines = [
      ["Section", "Label", "Value"].join(","),
      ["Fixed", r.fixedCharges, report.fixedChargesMonthly ?? ""].join(","),
    ];
    for (const row of report.rows) {
      lines.push(
        [
          "Recipe",
          row.name,
          row.status === "ok" ? (row.monthlyTotal ?? "") : r.statusIncomplete,
        ].join(","),
      );
    }
    lines.push(["Total", r.grandTotal, report.grandTotal ?? ""].join(","));
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "gramwise-monthly-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!fixed || !report) return null;

  const hasRecipes = report.rows.length > 0;

  return (
    <>
      <p className="eyebrow">{r.eyebrow}</p>
      <h1>{r.title}</h1>
      <p className="lead">{r.lead}</p>
      <p className="field-hint field-hint-block">{r.hint}</p>

      <section className="card monthly-report-summary">
        <h2>{r.summaryTitle}</h2>
        <div className="breakdown-dl">
          <div className="breakdown-row">
            <span className="breakdown-name">{r.fixedCharges}</span>
            <span className="breakdown-val">
              {report.fixedChargesMonthly === null
                ? "—"
                : formatMoney(report.fixedChargesMonthly)}
            </span>
          </div>
          {hasRecipes ? (
            <>
              <div className="breakdown-row">
                <span className="breakdown-name">{r.sumMaterials}</span>
                <span className="breakdown-val">
                  {formatMoney(report.sumMaterials)}
                </span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-name">{r.sumLabor}</span>
                <span className="breakdown-val">
                  {formatMoney(report.sumLabor)}
                </span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-name">{r.sumFixedShare}</span>
                <span className="breakdown-val">
                  {formatMoney(report.sumFixedAllocated)}
                </span>
              </div>
            </>
          ) : null}
          <div className="breakdown-row breakdown-row--total">
            <span className="breakdown-name">{r.grandTotal}</span>
            <span className="breakdown-val breakdown-val--accent">
              {report.grandTotal === null ? "—" : formatMoney(report.grandTotal)}
            </span>
          </div>
        </div>
        {report.incompleteCount > 0 ? (
          <p className="field-hint preview-error">{r.incompleteWarning}</p>
        ) : null}
      </section>

      {hasRecipes ? (
        <section className="card">
          <h2>{r.tableTitle}</h2>
          <p className="field-hint field-hint-block">{r.tableHint}</p>
          <div className="table-scroll">
            <table className="data-table data-table--report">
              <thead>
                <tr>
                  <th>{r.colRecipe}</th>
                  <th>{r.colVolume}</th>
                  <th>{r.colMaterials}</th>
                  <th>{r.colLabor}</th>
                  <th>{r.colFixedShare}</th>
                  <th>{r.colTotal}</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr
                    key={row.recipeId}
                    className={
                      row.status === "incomplete"
                        ? "monthly-report-row--incomplete"
                        : undefined
                    }
                  >
                    <td>{row.name}</td>
                    <td>
                      {row.status === "ok" && row.monthlyVolume !== null
                        ? `${row.monthlyVolume} ${volumeLabel(row.volumeKind, r)}`
                        : "—"}
                    </td>
                    <td>
                      {row.monthlyMaterials === null
                        ? "—"
                        : formatMoney(row.monthlyMaterials)}
                    </td>
                    <td>
                      {row.monthlyLabor === null
                        ? "—"
                        : formatMoney(row.monthlyLabor)}
                    </td>
                    <td>
                      {row.fixedShare === null
                        ? "—"
                        : formatMoney(row.fixedShare)}
                    </td>
                    <td>
                      {row.monthlyTotal === null
                        ? r.statusIncomplete
                        : formatMoney(row.monthlyTotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="card">
          <p className="field-hint">{r.emptyRecipes}</p>
          <p>
            <Link href="/recipe" className="btn btn-primary">
              {r.goRecipes}
            </Link>
          </p>
        </section>
      )}

      <nav className="step-nav">
        <Link href="/start" className="btn btn-ghost">
          {r.backStart}
        </Link>
        <div className="step-nav-end">
          {hasRecipes ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleExportCsv}
            >
              {r.exportCsv}
            </button>
          ) : null}
          <Link href="/recipe" className="btn btn-primary">
            {r.goRecipes}
          </Link>
        </div>
      </nav>
    </>
  );
}
