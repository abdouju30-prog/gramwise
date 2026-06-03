"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { INGREDIENT_QUANTITY_UNITS } from "@/lib/ingredient-units";
import {
  createCatalogIngredient,
  loadIngredientCatalog,
  saveIngredientCatalog,
  type CatalogIngredient,
} from "@/lib/ingredient-catalog";
import { useLocale, useMessages } from "@/lib/i18n/locale-provider";
import { CURRENCY_LABELS } from "@/lib/currency";
import type { IngredientQuantityUnit } from "@/lib/ingredient-units";

export function IngredientCatalogSection() {
  const m = useMessages();
  const { entryCurrency } = useLocale();
  const t = m.fixed.catalog;
  const searchRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<CatalogIngredient[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setItems(loadIngredientCatalog());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveIngredientCatalog(items);
  }, [items, hydrated]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.name.toLowerCase().includes(q));
  }, [items, query]);

  function openList() {
    setListOpen(true);
  }

  function revealAndFocus() {
    openList();
    searchRef.current?.focus();
  }

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

  const namedCount = items.filter((i) => i.name.trim()).length;

  return (
    <fieldset className="field-group catalog-panel">
      <div className="catalog-panel-head">
        <legend className="field-group-legend">{t.legend}</legend>
        <span className="catalog-panel-meta">
          {namedCount > 0 ? t.summaryCount.replace("{n}", String(namedCount)) : t.summaryEmpty}
        </span>
      </div>

      <p className="field-hint field-hint-block">{t.hint}</p>

      <div
        className={`catalog-search-zone${listOpen ? " catalog-search-zone--open" : ""}`}
        tabIndex={listOpen ? -1 : 0}
        aria-expanded={listOpen}
        aria-label={!listOpen ? t.openListAria : undefined}
        onClick={(e) => {
          if (listOpen) return;
          if (e.target === searchRef.current) return;
          revealAndFocus();
        }}
        onKeyDown={(e) => {
          if (listOpen) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            revealAndFocus();
          }
        }}
      >
        <label className="catalog-search field" onClick={(e) => e.stopPropagation()}>
          <span className="field-label">{t.searchLabel}</span>
          <div className="catalog-search-input-wrap">
            <span className="catalog-search-chevron" aria-hidden>
              {listOpen ? "▾" : "▸"}
            </span>
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                openList();
              }}
              onFocus={openList}
              placeholder={t.searchPlaceholder}
              autoComplete="off"
              aria-controls="catalog-ingredient-list"
            />
          </div>
        </label>
        {!listOpen ? (
          <p className="catalog-expand-hint">
            <span className="catalog-expand-icon" aria-hidden>
              ⋮
            </span>
            {t.expandHint}
          </p>
        ) : null}
      </div>

      {listOpen ? (
        <div id="catalog-ingredient-list" className="catalog-panel-body">
          <div className="catalog-grid" role="table">
            <div className="catalog-grid-head" role="row">
              <span role="columnheader">{t.name}</span>
              <span role="columnheader">{t.unit}</span>
              <span role="columnheader">
                {t.price} ({CURRENCY_LABELS[entryCurrency]})
              </span>
              <span className="catalog-grid-actions-head" aria-hidden />
            </div>
            {filteredItems.map((item) => (
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
                  onChange={(e) =>
                    updateItem(item.id, { costPerUnit: e.target.value })
                  }
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

          {filteredItems.length === 0 && query.trim() ? (
            <p className="field-hint">{t.searchEmpty}</p>
          ) : null}

          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setItems((prev) => [...prev, createCatalogIngredient()])}
          >
            {t.add}
          </button>
        </div>
      ) : null}
    </fieldset>
  );
}
