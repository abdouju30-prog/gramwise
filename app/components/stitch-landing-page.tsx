"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import "../stitch-landing.css";
import { HeroCanvas } from "./hero-canvas";
import { TiltCard } from "./tilt-card";

const CHEF_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuChDizSa0fc3iZ9waor-cn3ji2UYOfalTkczZhy235GCrXoZJR3qtNAC22ZF_rJQNXN6LtfEBGmboxbzKgmVmSVJgSwKvMxIRWS8pa-3-q7WDPhIpkg2g4_5Ba3TiyX6Ir7sdR9_Fh6zsBrA8m0BQzPjYlIyyYjEUEpFC1cNLmW9G7JM9ECcowUORL8hz2dyrmtg-Et4Ug5bNFMzBhuRN27HXGINPXvTKZKgYeuhNSEXNZ3shYtXxndPlWtDiCyEsq52LMecQSHTtY";

const TRUST_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAeBMCT_BY1wYeqdKhK24nsNqKaeN0esHU-dyG5jBY1Icpop48TeaMVZnBxMyMk8aYNuPfPXTXQ5e1zIk60pKaq35XZRyqVQR6rsrngw-OQanxB20GAkU6wFDrwz6typge5j85-a7MTnJRL8LFdX1DmQmE1IH1REiGkxiLYBXmc1k_jJTq54JnOUHOQwe5VHOFBM-c9V_xmRlKkjvBNu8dg0OZVgQpz09XkFQrh9NGZyUNh17vQtIxZNSCOjM36bEfYmhLgmi5uF0k",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBVjmNEzafhbgikj6q8MIjlnK7mGExCTwmeI80GAdqGqRpqZJu0S0nop7tgvK91oDgR_ZSpMymFKgh_EMhzEPRwzxI2KnZ9xX3NJuQ2pOGnV5WObUqe8k_yzH5C8G8exPILOcpcJGiWZYWATd2Q60moucw7O_86hMb_QXMsvkwUmYzyQUTTwrVEDendiYihC0qkIFFRN5iP0sQxd56eKYseUlyA59jD2a2XGSmdejLX91EKAVcry7zQa2wlx6AHkvx91_ujYHXR4jM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCaTh4yNeCsAQ_2_NX3ft8_X8mA5iiG_pRBi2H_MQZ88iYJStLMazDGWBVIIa9pg-aM0APJZDW--OhDVKDUmkyM7IAH7yNCwniEBFGNZom0KDLRcX-fNiHjqhSEQjngnDpkyF73JQZYMNmhWF-aEgd03YpSRCRMh1_BjqEZyLcG1niLb3CZhpUd39BAaQzErPEmF37Q2sRXt8NBOglx970SzmJInum7c-hJhHAYzgLVr814Wvn-MM593-k9EdKOl6lXUQ9C3mBFS8U",
];

const PRODUCTION_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCQsT-bzwZ7dED6bX2qJV0E_0EJ2ZpEv2wphQtNC1JBcDGe7N1FihGoTbjxOcYs_CHUeEuRH1v9FFOITPxSm84DGZZIfu8ppjIQ3QqMe2NkrrCX2TjeBoKofa4XMavXroBozHgQNko-tYj7nLolaG9BOYyD6ugXhzjXK0bgPUcW7whDJUqAcc-DtDV27KBTF2aOZRxtOjDFDEDVoGrFJR5E22apWqhi4EfDlxNE7uOpAS4hx7cuwCjbjNMmuJqpj-MVFArhLAMDsbE";

const EASE = [0.22, 1, 0.36, 1] as const;

const FADE_UP = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.7, ease: EASE } },
};

// Headline slides in from the left — more authoritative than fade-up
const SLIDE_LEFT = {
  hidden: { opacity: 0, x: -38 },
  show:   { opacity: 1, x: 0,  transition: { duration: 0.75, ease: EASE } },
};

// Lead text blurs in sharp — the "premium reveal" effect
const BLUR_REVEAL = {
  hidden: { opacity: 0, filter: "blur(9px)", y: 10 },
  show:   { opacity: 1, filter: "blur(0px)", y: 0,  transition: { duration: 0.8, ease: EASE } },
};

// CTAs pop in with spring physics — tactile, physical feel
const SPRING_POP = {
  hidden: { opacity: 0, scale: 0.86 },
  show:   { opacity: 1, scale: 1,  transition: { type: "spring" as const, stiffness: 360, damping: 26 } },
};

const STAGGER_HERO = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const STAGGER_BENTO = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const SCALE_FADE = {
  hidden: { opacity: 0, scale: 0.94 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

function Icon({ name, fill, className }: { name: string; fill?: boolean; className?: string }) {
  return (
    <span
      className={`material-symbols-outlined${className ? ` ${className}` : ""}`}
      aria-hidden="true"
      style={fill ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
    >
      {name}
    </span>
  );
}

export function StitchLandingPage() {
  const headerRef  = useRef<HTMLElement>(null);
  const mockupRef  = useRef<HTMLDivElement>(null);
  const bentoRef   = useRef<HTMLElement>(null);
  const footerRef  = useRef<HTMLElement>(null);
  const bentoInView  = useInView(bentoRef,  { once: true, margin: "-80px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-60px" });

  useEffect(() => {
    const header = headerRef.current;
    const mockup = mockupRef.current;

    const onScroll = () => {
      if (!header) return;
      header.classList.toggle("sl-header--scrolled", window.scrollY > 20);
    };

    const onMove = (e: MouseEvent) => {
      if (!mockup || window.innerWidth < 1024) return;
      const xAxis = (window.innerWidth  / 2 - e.pageX) / 55;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 55;
      mockup.style.transform =
        `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-12px) rotate(-2.5deg)`;
    };

    const onLeave = () => {
      if (!mockup) return;
      mockup.style.transform = "";
    };

    window.addEventListener("scroll",     onScroll, { passive: true });
    window.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    onScroll();

    return () => {
      window.removeEventListener("scroll",   onScroll);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="sl-page">

      {/* ── Header ───────────────────────────────────────────── */}
      <header ref={headerRef} className="sl-header">
        <div className="sl-container sl-header-inner">
          <div className="sl-header-left">
            <Link href="/" className="sl-brand">
              Pâtissier Archive
            </Link>
            <nav className="sl-nav-desktop" aria-label="Main">
              <Link href="/recipe" className="sl-nav-active">Recipes</Link>
              <Link href="/fixed-charges">Ingredients</Link>
              <Link href="/fixed-charges">Calculators</Link>
            </nav>
          </div>
          <div className="sl-header-right">
            <Link href="/account" className="sl-sign-in">Sign In</Link>
            <Link href="/account" className="sl-avatar" aria-label="Account">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CHEF_AVATAR} alt="" />
            </Link>
            <span className="material-symbols-outlined sl-menu-icon" aria-hidden="true">
              menu
            </span>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <main className="sl-hero">

        {/* Three.js ambient canvas — right side glow */}
        <div className="sl-hero-canvas-bg" aria-hidden="true">
          <HeroCanvas />
        </div>

        <div className="sl-container sl-hero-grid">

          {/* Copy — staggered entrance */}
          <motion.div
            className="sl-hero-copy"
            variants={STAGGER_HERO}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={FADE_UP} className="sl-badge">
              <Icon name="stars" fill className="sl-badge-icon" />
              V2.0 Premium Archive
            </motion.div>

            <motion.h1 variants={SLIDE_LEFT}>
              Know the <em>true</em> cost of every gram
            </motion.h1>

            <motion.p variants={BLUR_REVEAL} className="sl-hero-lead">
              Recipe costing for professional pastry chefs. Precision scaling,
              inventory tracking, and margin analysis in one tactile workspace.
            </motion.p>

            <motion.div variants={SPRING_POP} className="sl-hero-actions">
              <Link href="/fixed-charges" className="sl-btn-dark">
                Calculate your first recipe — free
              </Link>
              <Link href="/fixed-charges" className="sl-btn-outline">
                View Demo
              </Link>
            </motion.div>

            <motion.div variants={FADE_UP} className="sl-trust">
              <p className="sl-trust-label">Used by 1,200+ pastry chefs</p>
              <div className="sl-trust-logos">
                {TRUST_LOGOS.map((src) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={src.slice(-12)} src={src} alt="" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Mockup — slide from right */}
          <motion.div
            className="sl-mockup-col"
            style={{ perspective: "1100px" }}
            initial={{ opacity: 0, y: 64, rotateX: 14 }}
            animate={{ opacity: 1, y: 0,  rotateX: 0 }}
            transition={{ duration: 1.0, delay: 0.3, ease: EASE }}
          >
            <div ref={mockupRef} className="sl-mockup-wrap">
              <div className="sl-mockup">
                <div className="sl-mockup-chrome">
                  <div className="sl-mockup-dots">
                    <span /><span /><span />
                  </div>
                  <span className="sl-mockup-url">gramwise.app/archive/macaron-shell</span>
                  <span className="sl-mockup-chrome-spacer" aria-hidden />
                </div>
                <div className="sl-mockup-body">
                  <div className="sl-mockup-head">
                    <div>
                      <h3>Pistachio Macaron Shell</h3>
                      <p>Yield: 1.2 kg (approx. 140 shells)</p>
                    </div>
                    <div className="sl-mockup-price">
                      <strong>$42.84</strong>
                      <span className="sl-mockup-unit">UNIT: $0.31</span>
                    </div>
                  </div>
                  <div className="sl-mockup-lines">
                    <div>
                      <span>Almond Flour (Extra Fine)</span>
                      <span>300 g — $12.50</span>
                    </div>
                    <div>
                      <span>Icing Sugar</span>
                      <span>300 g — $2.10</span>
                    </div>
                    <div>
                      <span>Egg Whites (Liquid)</span>
                      <span>110 g — $1.85</span>
                    </div>
                    <div>
                      <span>Pistachio Paste (Bronte)</span>
                      <span>80 g — $24.40</span>
                    </div>
                  </div>
                  <div className="sl-mockup-metrics">
                    <div>
                      <span>Food cost</span>
                      <strong>18.4%</strong>
                    </div>
                    <div className="sl-metric-accent">
                      <span>Labor</span>
                      <strong>0.45h</strong>
                    </div>
                    <div>
                      <span>Profit</span>
                      <strong>$186</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating side notification */}
              <div className="sl-side-card">
                <div className="sl-side-card-head">
                  <div className="sl-side-card-icon">
                    <Icon name="inventory_2" />
                  </div>
                  <div>
                    <h4>Auto-Stock</h4>
                    <p>Inventory updated</p>
                  </div>
                </div>
                <div className="sl-side-bar"><div /></div>
                <p className="sl-side-stock">Pistachio paste: low stock</p>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* ── Bento features ───────────────────────────────────── */}
      <section ref={bentoRef} className="sl-bento">
        <div className="sl-container">

          <div className="sl-bento-intro">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={bentoInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.72, ease: EASE }}
            >Precision in every calculation.</motion.h2>
            <motion.p
              initial={{ opacity: 0, filter: "blur(7px)" }}
              animate={bentoInView ? { opacity: 1, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.78, delay: 0.16, ease: EASE }}
            >
              Crafted for the specific needs of high-end pâtisseries, where margins
              are as delicate as the mille-feuille.
            </motion.p>
          </div>

          <motion.div
            className="sl-bento-grid"
            variants={STAGGER_BENTO}
            initial="hidden"
            animate={bentoInView ? "show" : "hidden"}
          >
            {/* Card 1 — wide */}
            <motion.div variants={FADE_UP} className="sl-bento-wide">
              <TiltCard className="sl-bento-card" style={{ height: "100%" }}>
                <div className="sl-bento-stack">
                  <div>
                    <div className="sl-bento-icon">
                      <Icon name="calculate" />
                    </div>
                    <h3>Wastage Coefficient Tracking</h3>
                    <p className="sl-bento-body-md">
                      Factor in trim loss, dehydration, and bowl scrapage automatically.
                      See how much you&apos;re actually paying for used product, not just
                      purchased weight.
                    </p>
                  </div>
                  <div className="sl-bento-foot">
                    <div className="sl-bento-avatars">
                      <span /><span /><span />
                    </div>
                    <span className="sl-bento-trust">Trusted by Michelin Pastry Teams</span>
                  </div>
                </div>
                <Icon name="restaurant_menu" className="sl-bento-deco" />
              </TiltCard>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={SCALE_FADE}>
              <TiltCard className="sl-bento-card">
                <div className="sl-bento-icon sl-bento-icon--secondary">
                  <Icon name="payments" />
                </div>
                <h3>Dynamic Margins</h3>
                <p className="sl-bento-body-sm">
                  Real-time price fluctuates from suppliers? Update one ingredient and
                  see every recipe recalculate instantly.
                </p>
                <div className="sl-bento-bars" aria-hidden>
                  <span /><span /><span /><span />
                </div>
              </TiltCard>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={SCALE_FADE}>
              <TiltCard className="sl-bento-card">
                <div className="sl-bento-icon sl-bento-icon--tertiary">
                  <Icon name="kitchen" />
                </div>
                <h3>Sourcing Engine</h3>
                <p className="sl-bento-body-sm">
                  Compare costs across multiple vendors (Barry, Valrhona, Capfruit) to
                  find the best balance of quality and cost.
                </p>
              </TiltCard>
            </motion.div>

            {/* Card 4 — wide dark */}
            <motion.div
              variants={FADE_UP}
              className="sl-bento-wide"
            >
              <TiltCard className="sl-bento-card sl-bento-dark" max={4}>
                <div className="sl-bento-dark-inner">
                  <div>
                    <h3>Export to Production Sheets</h3>
                    <p className="sl-bento-body-md">
                      Turn costed recipes into clean, readable production sheets for
                      your kitchen team. Precision scaling by total weight or specific
                      component.
                    </p>
                    <Link href="/recipe" className="sl-bento-link">
                      Try Scaling Tool
                      <Icon name="arrow_right_alt" />
                    </Link>
                  </div>
                  <div className="sl-bento-dark-media">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={PRODUCTION_IMG} alt="Production sheet preview" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer ref={footerRef} className="sl-footer">
        <motion.div
          className="sl-container"
          initial={{ opacity: 0, y: 20 }}
          animate={footerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="sl-footer-grid">
            <div>
              <Link href="/" className="sl-footer-brand">
                Pâtissier Archive
              </Link>
              <p className="sl-footer-tagline">
                <span className="sl-kw-amber">Building</span> the modern standard for professional{" "}
                <span className="sl-kw-amber">pastry archive management</span>. Made for{" "}
                <span className="sl-kw-indigo">creators</span>,{" "}
                <span className="sl-kw-amber">curators</span>, and{" "}
                <span className="sl-kw-indigo">kitchen leaders</span>.
              </p>
            </div>
            <div>
              <h4>Product</h4>
              <ul>
                <li><Link href="#"><span className="sl-kw-indigo">Pricing</span></Link></li>
                <li><Link href="/account"><span className="sl-kw-amber">Integrations</span></Link></li>
                <li><Link href="/recipe"><span className="sl-kw-indigo">Recipe</span> Archive</Link></li>
                <li><Link href="/monthly-report"><span className="sl-kw-amber">Inventory</span> Sync</Link></li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li><Link href="/legal/privacy">Privacy</Link></li>
                <li><Link href="/legal/terms">Terms</Link></li>
                <li><Link href="/legal/cookies">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="sl-footer-bottom">
            <p className="sl-footer-copy">© 2024 GRAMWISE TECHNOLOGY. ALL RIGHTS RESERVED.</p>
            <div className="sl-footer-social">
              <Icon name="face_nod" />
              <Icon name="camera" />
            </div>
          </div>
        </motion.div>
      </footer>

      {/* ── Mobile nav ───────────────────────────────────────── */}
      <nav className="sl-mobile-nav" aria-label="Mobile">
        <Link href="/" className="sl-nav-fab" aria-label="Archive">
          <Icon name="auto_stories" />
        </Link>
        <Link href="/fixed-charges" aria-label="Calculators">
          <Icon name="payments" />
        </Link>
        <Link href="/recipe" aria-label="Recipes">
          <Icon name="egg" />
        </Link>
        <Link href="/results" aria-label="Results">
          <Icon name="analytics" />
        </Link>
      </nav>

    </div>
  );
}
