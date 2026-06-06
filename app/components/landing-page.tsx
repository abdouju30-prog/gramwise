"use client";

import { useMessages } from "@/lib/i18n/locale-provider";
import { LandingHeroSection } from "./landing-hero-section";
import { PricingSection } from "./pricing-section";
import {
  StatsStrip,
  TestimonialSection,
  FaqSection,
  StickyCtaMobile,
  FeatureBar,
  BenefitGrid,
  StepsList,
} from "./landing-sections";

export function LandingPage() {
  const m = useMessages();

  return (
    <>
      <main className="landing">
        <LandingHeroSection />
        <StatsStrip />

        <section className="landing-section">
          <h2 className="landing-heading">{m.landing.whyTitle}</h2>
          <BenefitGrid benefits={m.landing.benefits} />
          <FeatureBar />
        </section>

        <section className="landing-section">
          <h2 className="landing-heading">{m.landing.howTitle}</h2>
          <StepsList steps={m.landing.steps} />
        </section>

        <TestimonialSection />
        <FaqSection />
        <PricingSection />
      </main>
      <StickyCtaMobile />
    </>
  );
}
