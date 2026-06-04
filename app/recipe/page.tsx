"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { RecipeForm } from "./recipe-form";

export default function RecipePage() {
  const m = useMessages();

  return (
    <main>
      <div className="wizard-page-header" data-step="2">
        <p className="wizard-step-label">{m.recipe.eyebrow}</p>
        <h1>{m.recipe.title}</h1>
        <p className="lead">{m.recipe.lead}</p>
      </div>
      <RecipeForm />
    </main>
  );
}
