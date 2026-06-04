"use client";

import { useMessages } from "@/lib/i18n/locale-provider";

/** Decorative preview of the results screen — illustrative sample only. */
export function LandingProductDemo() {
  const m = useMessages();

  return (
    <div className="landing-demo" aria-hidden="true">
      <div className="landing-demo-frame">
        <div className="landing-demo-chrome">
          <span className="landing-demo-dot" />
          <span className="landing-demo-dot" />
          <span className="landing-demo-dot" />
          <span className="landing-demo-url">gramwise.app / results</span>
        </div>
        <article className="landing-demo-card card card-dark">
          <p className="landing-demo-badge">{m.landing.demoBadge}</p>
          <p className="landing-demo-recipe">{m.landing.demoRecipe}</p>
          <p className="hero-label">{m.landing.demoPriceLabel}</p>
          <p className="hero-value landing-demo-price">{m.landing.demoPrice}</p>
          <dl className="landing-demo-breakdown">
            {m.landing.demoRows.map((row) => (
              <div key={row.label} className="landing-demo-row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
      <p className="landing-demo-caption">{m.landing.demoCaption}</p>
    </div>
  );
}
