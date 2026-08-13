import { SiteHeader } from "@/components/home/site-header";
import { HeroSection } from "@/components/home/hero-section";
import { ValuePropsSection } from "@/components/home/value-props-section";
import { InfluencerShowcaseSection } from "@/components/home/influencer-showcase-section";
import { StatsSection } from "@/components/home/stats-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { SiteFooter } from "@/components/home/site-footer";

// Public marketing homepage (Tier 2, see SRS FR-G1) — communicates the value
// proposition to both Brands and Influencers.
export default function Home() {
  return (
    <main>
      <SiteHeader />
      <HeroSection />
      <ValuePropsSection />
      <InfluencerShowcaseSection />
      <StatsSection />
      <CtaBanner />
      <HowItWorksSection />
      <TestimonialsSection />
      <SiteFooter />
    </main>
  );
}
