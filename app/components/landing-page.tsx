"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMessages } from "@/lib/i18n/locale-provider";
import { LandingHeroSection } from "./landing-hero-section";
import { PricingSection } from "./pricing-section";
import { StickyCtaMobile } from "./landing-sections";

const ease = [0.22, 1, 0.36, 1] as const;

function useScrollReveal(margin = "-80px") {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });
  return { ref, inView };
}

function useCounter(target: number, active: boolean, duration = 1600) {
  const [value, setV] = require("react").useState(0);
  require("react").useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
}

function AnimatedStats({ stats }: { stats: Array<{ value: string; label: string }> }) {
  const { ref, inView } = useScrollReveal("-40px");
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className="v2-stats"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
    >
      {stats.map((s) => {
        const num = parseFloat(s.value.replace(/[^0-9.]/g, ""));
        const prefix = s.value.match(/^[^0-9]*/)?.[0] ?? "";
        const suffix = s.value.match(/[^0-9.]*$/)?.[0] ?? "";
        return (
          <motion.div
            key={s.label}
            className="v2-stats-item"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
            }}
          >
            <CounterValue prefix={prefix} num={num} suffix={suffix} active={inView && !reduce} />
            <span className="v2-stats-label">{s.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function CounterValue({ prefix, num, suffix, active }: { prefix: string; num: number; suffix: string; active: boolean }) {
  const val = useCounter(num, active);
  return <span className="v2-stats-value">{prefix}{active ? val : 0}{suffix}</span>;
}

const BENTO_FEATURES = [
  {
    wide: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3zM3 9h18M9 21V9"/>
      </svg>
    ),
    num: "0,001",
    numSuffix: "€",
    title: "Précision au gramme",
    body: "Chaque ingrédient est pesé et coûté à la gramme. Fini les estimations au paquet — vous savez exactement ce que coûte chaque gramme de farine, de beurre, de levure.",
  },
  {
    wide: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    num: "×2",
    numSuffix: "",
    title: "Marge automatique",
    body: "Définissez votre marge cible — le prix de vente s'ajuste en temps réel. Méthode marge sur prix de vente ou coefficient multiplicateur.",
  },
  {
    wide: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
    ),
    num: "3",
    numSuffix: " étapes",
    title: "Charges fixes réparties",
    body: "Loyer, électricité, amortissement — tout est réparti automatiquement sur chaque lot produit selon votre capacité mensuelle.",
  },
  {
    wide: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    num: "PDF",
    numSuffix: "",
    title: "Export & partage",
    body: "Exportez votre devis en PDF, partagez via lien, disponible en 3 langues (FR/EN/AR) et multi-devises (MAD, EUR, USD, GBP).",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Charges fixes",
    body: "Saisissez votre loyer, électricité, assurance, salaires. L'outil calcule le coût par heure de production ou par lot.",
  },
  {
    num: "02",
    title: "Recette",
    body: "Ajoutez vos ingrédients avec quantité et prix d'achat. Indiquez le temps de fabrication et le nombre de pièces produites.",
  },
  {
    num: "03",
    title: "Prix & résultats",
    body: "Obtenez le coût de revient exact, le prix de vente conseillé avec votre marge cible, et le seuil de rentabilité.",
  },
];

function BentoGrid() {
  const { ref, inView } = useScrollReveal("-60px");

  return (
    <motion.div
      ref={ref}
      className="v2-bento"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      {BENTO_FEATURES.map((f) => (
        <motion.div
          key={f.title}
          className={`v2-bento-card${f.wide ? " v2-bento-card--wide" : ""}`}
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
          }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <div className="v2-bento-icon">{f.icon}</div>
          <div className="v2-bento-num">{f.num}<span style={{ fontSize: "1.5rem", opacity: 0.6 }}>{f.numSuffix}</span></div>
          <h3 className="v2-bento-title">{f.title}</h3>
          <p className="v2-bento-body">{f.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function StepsSection() {
  const { ref, inView } = useScrollReveal("-60px");

  return (
    <motion.div
      ref={ref}
      className="v2-steps"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
    >
      {STEPS.map((s) => (
        <motion.div
          key={s.num}
          className="v2-step"
          variants={{
            hidden: { opacity: 0, x: -16 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
          }}
        >
          <span className="v2-step-num">{s.num}</span>
          <h3 className="v2-step-title">{s.title}</h3>
          <p className="v2-step-body">{s.body}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

function TestimonialV2() {
  const { ref, inView } = useScrollReveal("-60px");
  const m = useMessages();
  const t = m.landing.testimonial;

  return (
    <motion.div
      ref={ref}
      className="v2-testimonial"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease }}
    >
      <p className="v2-testimonial-quote">{t.quote}</p>
      <p className="v2-testimonial-author">
        <span className="v2-testimonial-name">{t.name}</span>
        {" — "}{t.role}
      </p>
    </motion.div>
  );
}

export function LandingPage() {
  const m = useMessages();

  return (
    <>
      <LandingHeroSection />

      <div className="v2-main">
        {/* Stats */}
        <AnimatedStats stats={m.landing.stats} />

        {/* Features bento */}
        <section className="v2-section">
          <p className="v2-section-label">Fonctionnalités</p>
          <h2>Tout ce dont un artisan a besoin pour fixer ses prix</h2>
          <BentoGrid />
        </section>

        {/* How it works */}
        <section className="v2-section">
          <p className="v2-section-label">Comment ça marche</p>
          <h2>Trois étapes, quinze minutes</h2>
          <StepsSection />
        </section>

        {/* Testimonial */}
        <TestimonialV2 />

        {/* Pricing */}
        <section className="v2-section" id="pricing">
          <p className="v2-section-label">Tarifs</p>
          <h2>Un accès, pour toujours</h2>
          <PricingSection />
        </section>
      </div>

      <StickyCtaMobile />
    </>
  );
}
