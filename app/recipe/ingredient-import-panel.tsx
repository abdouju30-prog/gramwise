"use client";

import { useCallback, useRef, useState } from "react";
import {
  INGREDIENT_QUANTITY_UNITS,
  type IngredientQuantityUnit,
} from "@/lib/ingredient-units";
import {
  parseIngredientText,
  readIngredientFile,
  type ParsedIngredientLine,
} from "@/lib/ingredient-import";
import { useMessages } from "@/lib/i18n/locale-provider";

type ImportTab = "paste" | "file" | "photo";

type Props = {
  onApply: (lines: ParsedIngredientLine[]) => void;
};

async function ocrImage(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("fra+eng", 1, {
    logger: () => {},
  });
  try {
    const { data } = await worker.recognize(file);
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export function IngredientImportPanel({ onApply }: Props) {
  const m = useMessages();
  const imp = m.recipe.import;
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<ImportTab>("paste");
  const [pasteText, setPasteText] = useState("");
  const [preview, setPreview] = useState<ParsedIngredientLine[] | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const runParse = useCallback((text: string) => {
    const lines = parseIngredientText(text);
    setPreview(lines.length > 0 ? lines : null);
    if (lines.length === 0) {
      setStatus("error");
      setErrorMsg(imp.parseEmpty);
    } else {
      setStatus("idle");
      setErrorMsg(null);
    }
  }, [imp.parseEmpty]);

  async function handleFile(file: File) {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const text = file.type.startsWith("image/")
        ? await ocrImage(file)
        : await readIngredientFile(file);
      setPasteText(text);
      runParse(text);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg(imp.fileError);
      setPreview(null);
    }
  }

  async function handlePhoto(file: File) {
    setStatus("loading");
    setErrorMsg(null);
    try {
      const text = await ocrImage(file);
      setPasteText(text);
      runParse(text);
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg(imp.photoError);
      setPreview(null);
    }
  }

  function handleApply() {
    if (!preview?.length) return;
    onApply(preview);
    setPreview(null);
    setPasteText("");
    setOpen(false);
    setStatus("idle");
    setErrorMsg(null);
  }

  return (
    <section className="import-panel" aria-labelledby="import-panel-title">
      <button
        type="button"
        className="btn btn-ghost btn-sm import-panel-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? imp.collapse : imp.expand}
      </button>

      {open ? (
        <div className="import-panel-body card">
          <h3 id="import-panel-title" className="import-panel-title">
            {imp.title}
          </h3>
          <p className="field-hint field-hint-block">{imp.hint}</p>

          <div className="import-tabs" role="tablist">
            {(["paste", "file", "photo"] as const).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={`import-tab${tab === id ? " import-tab--active" : ""}`}
                onClick={() => setTab(id)}
              >
                {imp.tabs[id]}
              </button>
            ))}
          </div>

          {tab === "paste" ? (
            <label className="field">
              <span className="field-label">{imp.pasteLabel}</span>
              <textarea
                className="import-textarea"
                rows={6}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={imp.pastePlaceholder}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={!pasteText.trim()}
                onClick={() => runParse(pasteText)}
              >
                {imp.analyze}
              </button>
            </label>
          ) : null}

          {tab === "file" ? (
            <div className="import-file-block">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.tsv,text/plain,text/csv,image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                className="btn btn-ghost"
                disabled={status === "loading"}
                onClick={() => fileInputRef.current?.click()}
              >
                {imp.chooseFile}
              </button>
              <p className="field-hint">{imp.fileTypes}</p>
            </div>
          ) : null}

          {tab === "photo" ? (
            <div className="import-file-block">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handlePhoto(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                className="btn btn-primary"
                disabled={status === "loading"}
                onClick={() => photoInputRef.current?.click()}
              >
                {status === "loading" ? imp.scanning : imp.takePhoto}
              </button>
              <p className="field-hint">{imp.photoHint}</p>
            </div>
          ) : null}

          {status === "loading" ? (
            <p className="preview-caption" role="status">
              {imp.scanning}
            </p>
          ) : null}

          {errorMsg ? (
            <p className="preview-caption preview-error" role="alert">
              {errorMsg}
            </p>
          ) : null}

          {preview && preview.length > 0 ? (
            <div className="import-preview">
              <p className="field-label">{imp.previewTitle(preview.length)}</p>
              <ul className="import-preview-list">
                {preview.map((row, i) => (
                  <li key={`${row.name}-${i}`}>
                    <strong>{row.name}</strong> — {row.quantity}{" "}
                    {unitLabel(imp.units, row.quantityUnit)}
                    {row.costPerUnit
                      ? ` · ${row.costPerUnit} ${imp.costSuffix(row.quantityUnit)}`
                      : ""}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleApply}
              >
                {imp.apply}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function unitLabel(
  units: Record<IngredientQuantityUnit, string>,
  unit: IngredientQuantityUnit,
): string {
  return units[unit] ?? unit;
}
