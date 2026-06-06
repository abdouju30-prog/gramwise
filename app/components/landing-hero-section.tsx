"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";
import { HeroBackground } from "./hero-background";
import { LandingProductDemo } from "./landing-product-demo";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease, delay },
});

export function LandingHeroSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const heroSteps = [m.nav.stepFixed, m.nav.stepRecipe, m.nav.stepResults];
  const sectionRef = useRef<HTMLElement>(null);
  const [scroll, setScroll] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setScroll(Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.55, 1))));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const heroStyle = { "--hero-scroll": scroll } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      className="landing-hero landing-hero--immersive"
      style={heroStyle}
    >
      <div className="landing-hero-stage" aria-hidden="true">
        <HeroBackground />
        <div className="landing-hero-stage-glow" />
        <div className="landing-hero-stage-vignette" />
      </div>

      <div className="landing-hero-content">
        <div className="landing-hero-body">
          <motion.p className="hero-eyebrow" {...fadeUp(0.05)}>
            {m.landing.eyebrow}
          </motion.p>

          <motion.h1 {...fadeUp(0.15)}>
            {m.landing.heroBefore}{" "}
            <span className="brand-accent">{m.landing.heroAccent}</span>
          </motion.h1>

          <motion.p className="lead landing-lead" {...fadeUp(0.25)}>
            {m.landing.lead}
          </motion.p>

          <motion.ol
            className="hero-steps"
            aria-label={m.landing.howTitle}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
            }}
          >
            {heroSteps.map((step, i) => (
              <motion.li
                key={step}
                className="hero-step"
                variants={{
                  hidden: { opacity: 0, x: -12 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease } },
                }}
              >
                <span className="hero-step-num">{i + 1}</span>
                <span>{step}</span>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div className="landing-actions" {...fadeUp(0.5)}>
            <Link href="/fixed-charges" className="btn btn-primary btn-lg btn-shimmer">
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
          </motion.div>
        </div>

        <motion.aside
          className="landing-hero-aside"
          initial={{ opacity: 0, x: 40, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.4 }}
        >
          <motion.div
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          >
            <LandingProductDemo />
          </motion.div>
        </motion.aside>
      </div>
    </section>
  );
}
