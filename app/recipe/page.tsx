"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { RecipeForm } from "./recipe-form";
import { WizardSettingsBar } from "../fixed-charges/wizard-settings-bar";

export default function RecipePage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.recipe.eyebrow}</p>
      <h1>{m.recipe.title}</h1>
      <p className="lead">{m.recipe.lead}</p>
      <WizardSettingsBar />
      <RecipeForm />
    </main>
  );
}
