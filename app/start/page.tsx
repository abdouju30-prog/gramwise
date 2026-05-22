import Link from "next/link";

export default function StartPage() {
  return (
    <main>
      <p className="eyebrow">Calculator</p>
      <h1>Your costing workflow</h1>
      <p className="lead">
        Three steps — fixed charges, recipe, then results with a full breakdown.
      </p>

      <nav className="home-steps">
        <Link href="/fixed-charges" className="card card-link">
          <span className="card-step">1</span>
          <span className="card-title">Fixed charges &amp; capacity</span>
          <span className="card-desc">Monthly overhead and batch or hourly spread</span>
        </Link>
        <Link href="/recipe" className="card card-link">
          <span className="card-step">2</span>
          <span className="card-title">Recipe</span>
          <span className="card-desc">Ingredients, labor, waste, margin</span>
        </Link>
        <Link href="/results" className="card card-link">
          <span className="card-step">3</span>
          <span className="card-title">Results</span>
          <span className="card-desc">Breakdown and recommended price</span>
        </Link>
      </nav>

      <p className="start-cta">
        <Link href="/fixed-charges" className="btn btn-primary">
          Begin step 1
        </Link>
      </p>
    </main>
  );
}
