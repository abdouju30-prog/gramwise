"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const STEPS = [
  { path: "/fixed-charges", label: "Fixed charges" },
  { path: "/recipe", label: "Recipe" },
  { path: "/results", label: "Results" },
] as const;

function stepIndex(pathname: string): number {
  const i = STEPS.findIndex((s) => pathname.startsWith(s.path));
  return i >= 0 ? i + 1 : 0;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const current = stepIndex(pathname);
  const onWizard = current > 0;

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-name">
            Gram<span className="brand-accent">Wise</span>
          </span>
          <span className="brand-tag">Pastry costing</span>
        </Link>
        {onWizard && (
          <nav className="wizard-progress" aria-label="Progress">
            {STEPS.map((step, i) => {
              const n = i + 1;
              const state =
                n < current ? "done" : n === current ? "active" : "upcoming";
              return (
                <Link
                  key={step.path}
                  href={step.path}
                  className={`wizard-step wizard-step--${state}`}
                  aria-current={state === "active" ? "step" : undefined}
                >
                  <span className="wizard-step-num">{n}</span>
                  <span className="wizard-step-label">{step.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>
      <div className="page-wrap">{children}</div>
    </>
  );
}
