"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";
import { signInWithEmail } from "@/lib/cloud-sync-remote";
import { useMessages } from "@/lib/i18n/locale-provider";

export function AccountView() {
  const m = useMessages();
  const a = m.account;
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const err = await signInWithEmail(email.trim());
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setSent(true);
  }

  async function handleSync() {
    setError(null);
    setBusy(true);
    const ok = await auth.syncNow();
    setBusy(false);
    if (!ok) setError(a.errorGeneric);
  }

  return (
    <>
      <p className="eyebrow">{a.eyebrow}</p>
      <h1>{a.title}</h1>
      <p className="lead">{a.lead}</p>

      {!auth.configured ? (
        <section className="card">
          <h2>{a.notConfiguredTitle}</h2>
          <p>{a.notConfiguredBody}</p>
        </section>
      ) : auth.userId ? (
        <section className="card">
          <p>
            <strong>{a.signedInAs}</strong> {auth.email}
          </p>
          {auth.syncing ? (
            <p className="field-hint">{a.syncing}</p>
          ) : auth.lastSync ? (
            <p className="field-hint">
              {a.lastSync} {new Date(auth.lastSync).toLocaleString()}
            </p>
          ) : null}
          <p className="field-hint field-hint-block">{a.syncHint}</p>
          <div className="step-nav-end">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || auth.syncing}
              onClick={() => void handleSync()}
            >
              {auth.syncing ? a.syncing : a.syncNow}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => void auth.signOut()}
            >
              {a.signOut}
            </button>
          </div>
        </section>
      ) : (
        <section className="card">
          <form className="form" onSubmit={(e) => void handleSendLink(e)}>
            <label className="field">
              <span className="field-label">{a.emailLabel}</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                placeholder={a.emailPlaceholder}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {a.sendLink}
            </button>
          </form>
          {sent ? (
            <p className="field-hint preview-caption">{a.linkSent}</p>
          ) : null}
        </section>
      )}

      {error ? <p className="preview-error">{error}</p> : null}

      <nav className="step-nav">
        <Link href="/start" className="btn btn-ghost">
          {m.nav.openCalculator}
        </Link>
      </nav>
    </>
  );
}
