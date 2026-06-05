"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";
import { HeroFoodScene } from "./hero-food-scene";
import { LandingProductDemo } from "./landing-product-demo";

export function LandingHeroSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const heroSteps = [m.nav.stepFixed, m.nav.stepRecipe, m.nav.stepResults];
  const sectionRef = useRef<HTMLElement>(null);
  const [scroll, setScroll] = useState(0);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const updateScroll = () => {
      const rect = el.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(rect.height * 0.55, 1)),
      );
      setScroll(progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMx(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    setMy(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }, []);

  const onPointerLeave = useCallback(() => {
    setMx(0);
    setMy(0);
  }, []);

  const heroStyle = {
    "--hero-scroll": scroll,
    "--hero-mx": mx,
    "--hero-my": my,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className="landing-hero landing-hero--immersive"
      style={heroStyle}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className="landing-hero-stage" aria-hidden="true">
        <div className="landing-hero-stage-glow" />
        <div className="landing-hero-stage-inner">
          <HeroFoodScene className="hero-food-scene--stage" />
        </div>
        <div className="landing-hero-stage-vignette" />
      </div>

      <div className="landing-hero-content">
        <div className="landing-hero-body">
          <p className="hero-eyebrow">{m.landing.eyebrow}</p>
          <h1>
            {m.landing.heroBefore}{" "}
            <span className="brand-accent">{m.landing.heroAccent}</span>
          </h1>
          <p className="lead landing-lead">{m.landing.lead}</p>
          <ol className="hero-steps" aria-label={m.landing.howTitle}>
            {heroSteps.map((step, i) => (
              <li key={step} className="hero-step">
                <span className="hero-step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="landing-actions">
            <Link href="/start" className="btn btn-primary btn-lg">
              {m.landing.openCalculator}
            </Link>
            {publicBeta ? (
              <Link href="/beta" className="btn btn-ghost btn-lg">
                {m.landing.betaTesters}
              </Link>
            ) : (
              <Link href="/#pricing" className="btn btn-ghost btn-lg">
                {m.landing.viewPricing}
              </Link>
            )}
          </div>
        </div>

        <aside className="landing-hero-aside">
          <LandingProductDemo />
        </aside>
      </div>
    </section>
  );
}
