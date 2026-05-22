"use client";

import Link from "next/link";
import { useMessages } from "@/lib/i18n/locale-provider";

export default function StartPage() {
  const m = useMessages();

  return (
    <main>
      <p className="eyebrow">{m.start.eyebrow}</p>
      <h1>{m.start.title}</h1>
      <p className="lead">{m.start.lead}</p>

      <nav className="home-steps">
        <Link href="/fixed-charges" className="card card-link">
          <span className="card-step">1</span>
          <span className="card-title">{m.start.step1Title}</span>
          <span className="card-desc">{m.start.step1Desc}</span>
        </Link>
        <Link href="/recipe" className="card card-link">
          <span className="card-step">2</span>
          <span className="card-title">{m.start.step2Title}</span>
          <span className="card-desc">{m.start.step2Desc}</span>
        </Link>
        <Link href="/results" className="card card-link">
          <span className="card-step">3</span>
          <span className="card-title">{m.start.step3Title}</span>
          <span className="card-desc">{m.start.step3Desc}</span>
        </Link>
      </nav>

      <p className="start-cta">
        <Link href="/fixed-charges" className="btn btn-primary">
          {m.start.cta}
        </Link>
      </p>
    </main>
  );
}
