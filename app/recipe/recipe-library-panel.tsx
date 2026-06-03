"use client";

import { useEffect, useState } from "react";
import {
  deleteSavedRecipe,
  loadRecipeLibrary,
  saveLibraryToUserFile,
  type SavedRecipe,
} from "@/lib/recipe-library";
import type { RecipeForm } from "@/lib/recipe";
import { useMessages } from "@/lib/i18n/locale-provider";

type Props = {
  onLoad: (recipe: RecipeForm) => void;
  refreshKey?: number;
};

export function RecipeLibraryPanel({ onLoad, refreshKey = 0 }: Props) {
  const m = useMessages();
  const lib = m.recipe.library;
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<SavedRecipe[]>([]);

  useEffect(() => {
    setEntries(loadRecipeLibrary());
  }, [refreshKey]);

  if (entries.length === 0) return null;

  return (
    <section className="recipe-library-compact">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {lib.expand(entries.length)}
      </button>

      {open ? (
        <ul className="recipe-library-list">
          {entries.map((entry) => (
            <li key={entry.id} className="recipe-library-item">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  onLoad(entry.recipe);
                  setOpen(false);
                }}
              >
                {entry.name}
              </button>
              <button
                type="button"
                className="btn-icon"
                aria-label={lib.delete}
                onClick={() => {
                  deleteSavedRecipe(entry.id);
                  setEntries(loadRecipeLibrary());
                }}
              >
                ×
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => void saveLibraryToUserFile()}
            >
              {lib.exportFile}
            </button>
          </li>
        </ul>
      ) : null}
    </section>
  );
}
