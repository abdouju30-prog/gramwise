import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main>
      <p className="eyebrow">Payment</p>
      <h1>Thank you</h1>
      <p className="lead">
        Your payment was received. You can use the calculator right away — account
        linking will follow in a later update.
      </p>
      <p className="start-cta">
        <Link href="/start" className="btn btn-primary">
          Open calculator
        </Link>
        <Link href="/" className="btn btn-ghost">
          Home
        </Link>
      </p>
    </main>
  );
}
