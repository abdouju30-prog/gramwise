"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useMessages } from "@/lib/i18n/locale-provider";

const ease = [0.22, 1, 0.36, 1] as const;

function useCounter(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * num));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return value;
}

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.]*$/)?.[0] ?? "";
  const count = useCounter(num, inView && !reduce);

  return (
    <motion.div
      ref={ref}
      className="stats-strip-item"
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease }}
    >
      <span className="stats-strip-value">
        {prefix}{inView && !reduce ? count : (reduce ? num : 0)}{suffix}
      </span>
      <span className="stats-strip-label">{label}</span>
    </motion.div>
  );
}

export function StatsStrip() {
  const m = useMessages();
  return (
    <div className="stats-strip">
      {m.landing.stats.map((s) => (
        <AnimatedStat key={s.label} value={s.value} label={s.label} />
      ))}
    </div>
  );
}

export function TestimonialSection() {
  const m = useMessages();
  const t = m.landing.testimonial;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      className="landing-testimonial"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease }}
    >
      <blockquote className="landing-testimonial-quote">{t.quote}</blockquote>
      <footer className="landing-testimonial-author">
        <span className="landing-testimonial-name">{t.name}</span>
        {", "}
        <span>{t.role}</span>
      </footer>
    </motion.section>
  );
}

export function FaqSection() {
  const m = useMessages();
  const [open, setOpen] = useState<number | null>(null);
  const toggle = (i: number) => setOpen((prev) => (prev === i ? null : i));
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      ref={ref}
      className="landing-faq landing-section"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, ease }}
    >
      <h2 className="landing-heading">{m.landing.faq.title}</h2>
      <ul className="faq-list">
        {m.landing.faq.items.map((item, i) => (
          <li key={item.q} className="faq-item">
            <button
              className="faq-trigger"
              onClick={() => toggle(i)}
              aria-expanded={open === i}
            >
              <span>{item.q}</span>
              <svg
                className={`faq-trigger-icon${open === i ? " faq-trigger-icon--open" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            {open === i && (
              <motion.p
                className="faq-answer"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease }}
              >
                {item.a}
              </motion.p>
            )}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}

export function StickyCtaMobile() {
  const m = useMessages();
  return (
    <div className="sticky-cta-mobile">
      <Link href="/fixed-charges" className="btn btn-primary sticky-cta-btn btn-shimmer">
        {m.landing.stickyCtaLabel}
      </Link>
    </div>
  );
}

const FEATURE_ICONS = [
  <svg key="scale" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="feature-bar-icon">
    <path d="M12 3v18M3 12h18M5 8l-2 4h4L5 8zM19 8l-2 4h4L19 8z"/>
    <line x1="3" y1="21" x2="21" y2="21"/>
  </svg>,
  <svg key="pct" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="feature-bar-icon">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>,
  <svg key="tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="feature-bar-icon">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/>
  </svg>,
  <svg key="dl" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="feature-bar-icon">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>,
];

export function FeatureBar() {
  const m = useMessages();
  const items = m.landing.trustItems.slice(0, 4);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="feature-bar"
      aria-hidden="true"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {items.map((label, i) => (
        <motion.div
          key={label}
          className="feature-bar-item"
          variants={{
            hidden: { opacity: 0, y: 12 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
          }}
        >
          {FEATURE_ICONS[i]}
          <span className="feature-bar-label">{label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

export function BenefitGrid({ benefits }: { benefits: { title: string; body: string }[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.ul
      ref={ref}
      className="benefit-grid"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {benefits.map((b, i) => (
        <motion.li
          key={b.title}
          className="benefit-card"
          variants={{
            hidden: { opacity: 0, y: 28 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
          }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <span className="benefit-num" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{b.title}</h3>
          <p>{b.body}</p>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function StepsList({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.ol
      ref={ref}
      className="steps-list steps-list--cards"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15 } },
      }}
    >
      {steps.map((text, i) => (
        <motion.li
          key={text}
          className="steps-list-card"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
          }}
          whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
          <span className="steps-list-num" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="steps-list-text">{text}</span>
        </motion.li>
      ))}
    </motion.ol>
  );
}
