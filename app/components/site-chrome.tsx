"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useMessages } from "@/lib/i18n/locale-provider";

const STEP_PATHS = [
  { path: "/fixed-charges", key: "stepFixed" as const },
  { path: "/recipe", key: "stepRecipe" as const },
  { path: "/results", key: "stepResults" as const },
];

function stepIndex(pathname: string): number {
  const i = STEP_PATHS.findIndex((s) => pathname.startsWith(s.path));
  return i >= 0 ? i + 1 : 0;
}

function isWizardRoute(pathname: string): boolean {
  return STEP_PATHS.some((s) => pathname.startsWith(s.path));
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const m = useMessages();
  const current = stepIndex(pathname);
  const onWizard = isWizardRoute(pathname);
  const onLanding = pathname === "/";

  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-name">
            Gram<span className="brand-accent">Wise</span>
          </span>
          <span className="brand-tag">{m.brand.tag}</span>
        </Link>
        <LanguageSwitcher />
        {onWizard && (
          <nav className="wizard-progress" aria-label={m.nav.progress}>
            {STEP_PATHS.map((step, i) => {
              const n = i + 1;
              const state =
                n < current ? "done" : n === current ? "active" : "upcoming";
              const label = m.nav[step.key];
              return (
                <Link
                  key={step.path}
                  href={step.path}
                  className={`wizard-step wizard-step--${state}`}
                  aria-label={label}
                  aria-current={state === "active" ? "step" : undefined}
                >
                  <span className="wizard-step-num">{n}</span>
                  <span className="wizard-step-label">{label}</span>
                </Link>
              );
            })}
          </nav>
        )}
        {!onWizard && (
          <Link
            href={onLanding ? "/start" : "/"}
            className="btn btn-primary header-cta"
          >
            {onLanding ? m.nav.openCalculator : m.nav.home}
          </Link>
        )}
      </header>
      <div className="page-wrap">{children}</div>
    </>
  );
}
