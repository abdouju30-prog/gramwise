import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>GramWise</h1>
      <p className="lead">
        Pastry costing — fixed charges, recipe, margin on selling price.
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
    </main>
  );
}
