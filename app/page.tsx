import { calculateCosting } from "@/engine";
import { REFERENCE_CASES } from "@/engine/fixtures/cases";

const demo = REFERENCE_CASES[0];
const result = calculateCosting(demo.input);

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export default function Home() {
  return (
    <main>
      <h1>GramWise</h1>
      <p className="lead">
        App shell — costing engine wired (reference case {demo.id}:{" "}
        {demo.name}).
      </p>

      <section className="card" aria-labelledby="demo-heading">
        <h2 id="demo-heading">Engine preview</h2>
        <dl>
          <dt>Full cost</dt>
          <dd>{formatMoney(result.fullCost)}</dd>
          <dt>Break-even</dt>
          <dd>{formatMoney(result.breakEvenPrice)}</dd>
          <dt>Recommended price</dt>
          <dd>{formatMoney(result.recommendedPrice)}</dd>
        </dl>
        <p className="status">engine/ · calculateCosting · server-rendered</p>
      </section>
    </main>
  );
}
