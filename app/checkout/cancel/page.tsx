import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main>
      <p className="eyebrow">Payment</p>
      <h1>Checkout cancelled</h1>
      <p className="lead">
        No charge was made. The calculator stays free during beta.
      </p>
      <p className="start-cta">
        <Link href="/#pricing" className="btn btn-primary">
          View pricing
        </Link>
        <Link href="/start" className="btn btn-ghost">
          Open calculator
        </Link>
      </p>
    </main>
  );
}
