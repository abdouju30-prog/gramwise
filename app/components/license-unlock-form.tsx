"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMessages } from "@/lib/i18n/locale-provider";

type Props = {
  showTitle?: boolean;
};

export function LicenseUnlockForm({ showTitle = true }: Props) {
  const m = useMessages();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next")?.trim() || "/start";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/gumroad/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? m.unlock.errorInvalid);
        return;
      }
      router.push(nextPath.startsWith("/") ? nextPath : "/start");
      router.refresh();
    } catch {
      setError(m.unlock.errorInvalid);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="form license-unlock-form" onSubmit={onSubmit}>
      {showTitle && (
        <>
          <h2 className="license-unlock-title">{m.unlock.formTitle}</h2>
          <p className="field-hint field-hint-block">{m.unlock.formHint}</p>
        </>
      )}
      <label className="field">
        <span className="field-label">{m.unlock.licenseLabel}</span>
        <input
          type="text"
          name="license_key"
          autoComplete="off"
          spellCheck={false}
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder={m.unlock.licensePlaceholder}
          required
        />
      </label>
      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? m.unlock.submitting : m.unlock.submit}
      </button>
    </form>
  );
}
