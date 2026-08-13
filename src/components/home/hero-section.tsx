import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroVisual } from "@/components/home/hero-visual";

export function HeroSection() {
  return (
    <section id="top" className="relative overflow-hidden bg-brand-blue">
      <div className="absolute -top-24 -right-24 size-72 rounded-full bg-white/10" />
      <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/10" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div className="text-center lg:text-left">
          <p className="text-sm font-bold tracking-widest text-white/80 uppercase">
            #GetMatched
          </p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold text-white sm:text-5xl">
            Grow your influence. Grow your brand.
          </h1>
          <p className="mt-4 max-w-md text-base text-white/85 lg:mx-0 lg:max-w-lg">
            Reachly matches brand campaigns with the right creators by niche, audience, and
            engagement — so brands find creators who convert, and influencers get paid to be
            themselves.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/signup">
              <Button variant="ghost" fullWidth={false} className="px-9 py-4">
                Sign Up Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <button className="w-full rounded-full border border-white/70 px-9 py-4 text-sm font-bold tracking-wide text-white uppercase transition hover:bg-white/10 sm:w-auto">
                See How It Works
              </button>
            </a>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}
