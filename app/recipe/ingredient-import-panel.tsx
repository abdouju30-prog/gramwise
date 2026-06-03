"use client";

import { useCallback, useRef, useState } from "react";
import {
  type IngredientQuantityUnit,
} from "@/lib/ingredient-units";
import {
  parseIngredientText,
  readIngredientFile,
  type ParsedIngredientLine,
} from "@/lib/ingredient-import";
import { useMessages } from "@/lib/i18n/locale-provider";

type Props = {
  onApply: (lines: ParsedIngredientLine[]) => void;
};

async function ocrImage(file: File): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("fra+eng", 1, { logger: () => {} });
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
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<ParsedIngredientLine[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const organize = useCallback(
    (raw: string) => {
      const lines = parseIngredientText(raw);
      setPreview(lines.length > 0 ? lines : null);
      if (lines.length === 0) {
        setErrorMsg(imp.parseEmpty);
      } else {
        setErrorMsg(null);
      }
    },
    [imp.parseEmpty],
  );

  async function fromImage(file: File) {
    setBusy(true);
    setErrorMsg(null);
    try {
      const extracted = await ocrImage(file);
      setText(extracted);
      organize(extracted);
    } catch {
      setErrorMsg(imp.photoError);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  async function fromFile(file: File) {
    setBusy(true);
    setErrorMsg(null);
    try {
      const extracted = file.type.startsWith("image/")
        ? await ocrImage(file)
        : await readIngredientFile(file);
      setText(extracted);
      organize(extracted);
    } catch {
      setErrorMsg(imp.fileError);
      setPreview(null);
    } finally {
      setBusy(false);
    }
  }

  function handleApply() {
    if (!preview?.length) return;
    onApply(preview);
    setPreview(null);
    setText("");
    setErrorMsg(null);
  }

  return (
    <div className="import-simple">
      <p className="import-simple-lead">{imp.lead}</p>

      <div className="import-simple-actions">
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void fromImage(file);
            e.target.value = "";
          }}
        />
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.csv,.tsv,text/plain,text/csv"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void fromFile(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={busy}
          onClick={() => photoRef.current?.click()}
        >
          {imp.photo}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {imp.file}
        </button>
      </div>

      <label className="field import-simple-paste">
        <span className="sr-only">{imp.pasteLabel}</span>
        <textarea
          className="import-textarea"
          rows={4}
          value={text}
          disabled={busy}
          onChange={(e) => setText(e.target.value)}
          placeholder={imp.pastePlaceholder}
        />
      </label>

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        disabled={busy || !text.trim()}
        onClick={() => organize(text)}
      >
        {imp.organize}
      </button>

      {busy ? (
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
                {row.name} — {row.quantity}{" "}
                {imp.units[row.quantityUnit as IngredientQuantityUnit]}
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
  );
}
