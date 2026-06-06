"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { isPublicBeta } from "@/lib/beta";
import { useMessages } from "@/lib/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease, delay },
});

const DEMO_ROWS = [
  { name: "Farine & levain",   val: "1,80 €", pct: 37 },
  { name: "Beurre AOP",        val: "2,10 €", pct: 43 },
  { name: "Charges fixes",     val: "0,60 €", pct: 12 },
  { name: "Main d'œuvre",      val: "0,35 €", pct: 7  },
];

export function LandingHeroSection() {
  const m = useMessages();
  const publicBeta = isPublicBeta();
  const reduce = useReducedMotion();

  return (
    <section className="v2-hero">
      <div className="v2-hero-inner">

        {/* Badge */}
        <motion.div {...fadeUp(0)}>
          <span className="v2-badge">
            <span className="v2-badge-dot" aria-hidden="true" />
            Calculateur pâtisserie professionnel
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.1)}>
          Connaissez le coût{" "}
          <em>exact</em>{" "}
          de chaque recette
        </motion.h1>

        {/* Sub */}
        <motion.p className="v2-hero-sub" {...fadeUp(0.2)}>
          Le seul outil qui répartit vos charges fixes sur chaque gramme produit
          — et calcule votre prix de vente avec marge, au centime près.
        </motion.p>

        {/* CTAs */}
        <motion.div className="v2-hero-actions" {...fadeUp(0.3)}>
          <Link href="/fixed-charges" className="v2-btn-primary">
            {m.landing.openCalculator}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          {publicBeta ? (
            <Link href="/beta" className="v2-btn-ghost">{m.landing.betaTesters}</Link>
          ) : (
            <Link href="/#pricing" className="v2-btn-ghost">{m.landing.viewPricing}</Link>
          )}
        </motion.div>

        {/* Product demo — full width card */}
        <motion.div
          className="v2-demo-wrap"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.45 }}
        >
          <div className="v2-demo-glow" aria-hidden="true" />
          <motion.div
            className="v2-demo-card"
            animate={reduce ? {} : { y: [0, -6, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            {/* Browser chrome */}
            <div className="v2-demo-chrome" aria-hidden="true">
              <span className="v2-demo-dot" />
              <span className="v2-demo-dot" />
              <span className="v2-demo-dot" />
              <span className="v2-demo-url">gramwise.vercel.app/results</span>
            </div>

            {/* Content */}
            <div className="v2-demo-body">
              {/* Left — cost breakdown */}
              <div className="v2-demo-col">
                <p className="v2-demo-label">Recette analysée</p>
                <p className="v2-demo-recipe">Croissants au beurre × 24 pièces</p>

                <p className="v2-demo-label">Coût de revient / pièce</p>
                <p className="v2-demo-price">4,85 <span style={{ fontSize: "1.5rem" }}>€</span></p>
                <p className="v2-demo-price-sub">Matière · Charges · Main d'œuvre inclus</p>

                <div className="v2-demo-rows">
                  {DEMO_ROWS.map((r) => (
                    <div key={r.name} className="v2-demo-row">
                      <span className="v2-demo-row-name">{r.name}</span>
                      <div className="v2-demo-row-bar-wrap">
                        <div className="v2-demo-row-bar" style={{ width: `${r.pct}%` }} />
                      </div>
                      <span className="v2-demo-row-val">{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — suggested price */}
              <div className="v2-demo-col">
                <p className="v2-demo-label">Prix de vente conseillé</p>
                <div className="v2-demo-suggested">
                  <p className="v2-demo-suggested-label">Marge 50% sur prix de vente</p>
                  <p className="v2-demo-suggested-price">9,70 €</p>
                  <p className="v2-demo-suggested-margin">× 2,0 sur coût — rentable dès 13 pièces</p>
                </div>

                <div style={{ marginTop: "1.75rem" }}>
                  <p className="v2-demo-label">Charges fixes réparties</p>
                  <div className="v2-demo-rows">
                    {[
                      { name: "Loyer atelier", val: "0,18 €" },
                      { name: "Électricité four", val: "0,09 €" },
                      { name: "Amortissement", val: "0,07 €" },
                    ].map((r) => (
                      <div key={r.name} className="v2-demo-row">
                        <span className="v2-demo-row-name">{r.name}</span>
                        <span className="v2-demo-row-val">{r.val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: "auto",
                  paddingTop: "1.5rem",
                  borderTop: "1px solid rgba(251,246,239,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}>
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "1.5rem",
                    height: "1.5rem",
                    borderRadius: "50%",
                    background: "rgba(212,148,31,0.15)",
                    fontSize: "0.75rem",
                  }}>✓</span>
                  <span style={{ fontSize: "0.72rem", color: "rgba(251,246,239,0.4)" }}>
                    Export PDF · Partage lien · Multi-devises
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
