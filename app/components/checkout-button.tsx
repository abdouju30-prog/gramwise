"use client";

import { useState } from "react";
import type { CheckoutPlan } from "@/lib/stripe";

type Props = {
  plan: CheckoutPlan;
  className?: string;
  children: React.ReactNode;
};

export function CheckoutButton({ plan, className, children }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not start checkout.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="checkout-button-wrap">
      <button
        type="button"
        className={className}
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? "Redirecting…" : children}
      </button>
      {error && (
        <span className="checkout-error" role="alert">
          {error}
        </span>
      )}
    </span>
  );
}
