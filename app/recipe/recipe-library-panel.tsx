"use client";

import { useCallback, useRef, useState } from "react";
import {
  deleteSavedRecipe,
  downloadRecipeLibraryJson,
  loadRecipeLibrary,
  mergeImportedLibrary,
  saveLibraryToUserFile,
  type SavedRecipe,
} from "@/lib/recipe-library";
import type { RecipeForm } from "@/lib/recipe";
import { useMessages } from "@/lib/i18n/locale-provider";

type Props = {
  onLoad: (recipe: RecipeForm) => void;
};

export function RecipeLibraryPanel({ onLoad }: Props) {
  const m = useMessages();
  const lib = m.recipe.library;
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SavedRecipe[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    setEntries(loadRecipeLibrary());
  }, []);

  function toggle() {
    setOpen((v) => {
      if (!v) refresh();
      return !v;
    });
  }

  async function handleSaveToPc() {
    try {
      const mode = await saveLibraryToUserFile();
      setStatus(mode === "picker" ? lib.savedPicker : lib.savedDownload);
    } catch {
      setStatus(lib.saveError);
    }
  }

  function handleImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const count = mergeImportedLibrary(String(reader.result ?? ""));
        refresh();
        setStatus(lib.imported(count));
      } catch {
        setStatus(lib.importError);
      }
    };
    reader.readAsText(file);
  }

  return (
    <section className="recipe-library">
      <button
        type="button"
        className="btn btn-ghost btn-sm recipe-library-toggle"
        onClick={toggle}
        aria-expanded={open}
      >
        {open ? lib.collapse : lib.expand}
      </button>

      {open ? (
        <div className="card recipe-library-body">
          <h3 className="import-panel-title">{lib.title}</h3>
          <p className="field-hint field-hint-block">{lib.hint}</p>

          <div className="recipe-library-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => downloadRecipeLibraryJson()}
            >
              {lib.exportJson}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => void handleSaveToPc()}
            >
              {lib.saveToPc}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImport(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => fileRef.current?.click()}
            >
              {lib.importJson}
            </button>
          </div>

          {status ? (
            <p className="preview-caption" role="status">
              {status}
            </p>
          ) : null}

          {entries.length === 0 ? (
            <p className="preview-caption">{lib.empty}</p>
          ) : (
            <ul className="recipe-library-list">
              {entries.map((entry) => (
                <li key={entry.id} className="recipe-library-item">
                  <div>
                    <strong>{entry.name}</strong>
                    <span className="recipe-library-date">
                      {new Date(entry.savedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="recipe-library-item-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => onLoad(entry.recipe)}
                    >
                      {lib.load}
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={lib.delete}
                      onClick={() => {
                        deleteSavedRecipe(entry.id);
                        refresh();
                      }}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
