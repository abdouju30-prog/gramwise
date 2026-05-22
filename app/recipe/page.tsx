import { RecipeForm } from "./recipe-form";

export default function RecipePage() {
  return (
    <main>
      <p className="eyebrow">Step 2 of 3</p>
      <h1>Recipe</h1>
      <p className="lead">
        Ingredients, labor phases, waste and target margin on selling price.
      </p>
      <RecipeForm />
    </main>
  );
}
