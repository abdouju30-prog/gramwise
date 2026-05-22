import { FixedChargesForm } from "./fixed-charges-form";

export default function FixedChargesPage() {
  return (
    <main>
      <p className="eyebrow">Step 1 of 3</p>
      <h1>Fixed charges &amp; capacity</h1>
      <p className="lead">
        Set monthly overhead and how you spread it before building a recipe.
      </p>
      <FixedChargesForm />
    </main>
  );
}
