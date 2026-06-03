"use client";

import { useEffect, useState } from "react";
import { INGREDIENT_QUANTITY_UNITS } from "@/lib/ingredient-units";
import {
  createCatalogIngredient,
  loadIngredientCatalog,
  saveIngredientCatalog,
  type CatalogIngredient,
} from "@/lib/ingredient-catalog";
import { useMessages } from "@/lib/i18n/locale-provider";
import type { IngredientQuantityUnit } from "@/lib/ingredient-units";

export function IngredientCatalogSection() {
  const m = useMessages();
  const t = m.fixed.catalog;
  const [items, setItems] = useState<CatalogIngredient[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadIngredientCatalog());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveIngredientCatalog(items);
  }, [items, hydrated]);

  function updateItem(id: string, patch: Partial<CatalogIngredient>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((item) => item.id !== id);
    });
  }

  if (!hydrated) return null;

  return (
    <fieldset className="field-group">
      <legend className="field-group-legend">{t.legend}</legend>
      <p className="field-hint field-hint-block">{t.hint}</p>

      <div className="catalog-grid" role="table">
        <div className="catalog-grid-head" role="row">
          <span role="columnheader">{t.name}</span>
          <span role="columnheader">{t.unit}</span>
          <span role="columnheader">{t.price}</span>
          <span className="catalog-grid-actions-head" aria-hidden />
        </div>
        {items.map((item) => (
          <div key={item.id} className="catalog-grid-row" role="row">
            <input
              type="text"
              role="cell"
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
              placeholder={t.namePlaceholder}
              aria-label={t.name}
            />
            <select
              role="cell"
              value={item.quantityUnit}
              onChange={(e) =>
                updateItem(item.id, {
                  quantityUnit: e.target.value as IngredientQuantityUnit,
                })
              }
              aria-label={t.unit}
            >
              {INGREDIENT_QUANTITY_UNITS.map((u) => (
                <option key={u} value={u}>
                  {m.recipe.import.units[u]}
                </option>
              ))}
            </select>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              role="cell"
              value={item.costPerUnit}
              onChange={(e) => updateItem(item.id, { costPerUnit: e.target.value })}
              placeholder="0"
              aria-label={t.price}
            />
            {items.length > 1 ? (
              <button
                type="button"
                className="btn-icon"
                onClick={() => removeItem(item.id)}
                aria-label={`${t.remove} — ${item.name || t.namePlaceholder}`}
              >
                ×
              </button>
            ) : (
              <span className="catalog-grid-actions-head" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => setItems((prev) => [...prev, createCatalogIngredient()])}
      >
        {t.add}
      </button>
    </fieldset>
  );
}
