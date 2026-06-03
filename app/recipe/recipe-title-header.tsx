"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  loadRecipeLibrary,
  saveLibraryToUserFile,
  type SavedRecipe,
} from "@/lib/recipe-library";
import { CUPCAKES_PRESET, type RecipeForm } from "@/lib/recipe";
import { useMessages } from "@/lib/i18n/locale-provider";

export const RECIPE_PICKER_CUPCAKES = "preset:cupcakes";

type Props = {
  name: string;
  onNameChange: (name: string) => void;
  onPickRecipe: (recipe: RecipeForm) => void;
  onNewRecipe: () => void;
  refreshKey?: number;
};

function RecipeTitleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4h12a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2-3-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 8h6M9 12h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RecipeTitleHeader({
  name,
  onNameChange,
  onPickRecipe,
  onNewRecipe,
  refreshKey = 0,
}: Props) {
  const m = useMessages();
  const t = m.recipe.titleHeader;
  const nameInputId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<SavedRecipe[]>([]);
  const [picker, setPicker] = useState("");

  useEffect(() => {
    setSaved(loadRecipeLibrary());
    setPicker("");
  }, [refreshKey]);

  function handlePick(value: string) {
    setPicker(value);
    if (value === "") {
      onNewRecipe();
      return;
    }
    if (value === RECIPE_PICKER_CUPCAKES) {
      onPickRecipe(CUPCAKES_PRESET);
      return;
    }
    const entry = saved.find((e) => e.id === value);
    if (entry) onPickRecipe(entry.recipe);
  }

  return (
    <div className="recipe-title-header">
      <button
        type="button"
        className="recipe-title-icon-btn"
        aria-label={t.iconLabel}
        title={t.iconLabel}
        onClick={() => {
          nameRef.current?.focus();
          nameRef.current?.select();
        }}
      >
        <RecipeTitleIcon />
      </button>

      <div className="recipe-title-fields">
        <label className="field">
          <span className="field-label">{t.chooseRecipe}</span>
          <select
            className="recipe-picker"
            value={picker}
            onChange={(e) => handlePick(e.target.value)}
          >
            <option value="">{t.newRecipe}</option>
            <option value={RECIPE_PICKER_CUPCAKES}>{t.presetCupcakes}</option>
            {saved.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field" htmlFor={nameInputId}>
          <span className="field-label">{m.recipe.nameLabel}</span>
          <input
            id={nameInputId}
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={m.recipe.namePlaceholder}
          />
        </label>
      </div>

      {saved.length > 0 ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm recipe-export-btn"
          onClick={() => void saveLibraryToUserFile()}
        >
          {m.recipe.library.exportFile}
        </button>
      ) : null}
    </div>
  );
}
