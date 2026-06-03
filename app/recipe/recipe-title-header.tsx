"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  loadRecipeLibrary,
  saveLibraryToUserFile,
  type SavedRecipe,
} from "@/lib/recipe-library";
import { useMessages } from "@/lib/i18n/locale-provider";

export const RECIPE_PICKER_CUPCAKES = "preset:cupcakes";

type Props = {
  picker: string;
  onPickerChange: (value: string) => void;
  name: string;
  onNameChange: (name: string) => void;
  onDeleteSaved: () => void;
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

export function isSavedRecipePicker(picker: string): boolean {
  return picker !== "" && picker !== RECIPE_PICKER_CUPCAKES;
}

export function RecipeTitleHeader({
  picker,
  onPickerChange,
  name,
  onNameChange,
  onDeleteSaved,
  refreshKey = 0,
}: Props) {
  const m = useMessages();
  const t = m.recipe.titleHeader;
  const nameInputId = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [saved, setSaved] = useState<SavedRecipe[]>([]);
  const canDelete = isSavedRecipePicker(picker);

  useEffect(() => {
    setSaved(loadRecipeLibrary());
  }, [refreshKey]);

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
          <div className="recipe-picker-row">
            <select
              className="recipe-picker"
              value={picker}
              onChange={(e) => onPickerChange(e.target.value)}
            >
              <option value="">{t.newRecipe}</option>
              <option value={RECIPE_PICKER_CUPCAKES}>{t.presetCupcakes}</option>
              {saved.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name}
                </option>
              ))}
            </select>
            {canDelete ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm recipe-delete-btn"
                onClick={onDeleteSaved}
              >
                {t.deleteRecipe}
              </button>
            ) : null}
          </div>
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

export function useSavedRecipes(refreshKey: number): SavedRecipe[] {
  const [saved, setSaved] = useState<SavedRecipe[]>([]);
  useEffect(() => {
    setSaved(loadRecipeLibrary());
  }, [refreshKey]);
  return saved;
}

export { loadRecipeLibrary };
