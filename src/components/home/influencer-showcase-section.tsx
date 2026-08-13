import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAMPLE_PROFILES = [
  { name: "Emily Roy", niche: "Lifestyle", followers: "1.1M", rating: "5.0", accent: "bg-brand-orange/10 text-brand-orange" },
  { name: "Lisa Neal", niche: "Travel", followers: "210K", rating: "4.9", accent: "bg-brand-blue/10 text-brand-blue" },
  { name: "John Doe", niche: "Tech", followers: "526K", rating: "4.8", accent: "bg-brand-blue/10 text-brand-blue" },
  { name: "Nick Onell", niche: "Fitness", followers: "302K", rating: "5.0", accent: "bg-brand-orange/10 text-brand-orange" },
];

export function InfluencerShowcaseSection() {
  return (
    <section id="influencers" className="bg-[#f8f8f8] py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          {SAMPLE_PROFILES.map((profile, index) => (
            <div
              key={profile.name}
              className={`rounded-2xl bg-white p-4 shadow-sm ${index % 2 === 1 ? "mt-8" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex size-10 items-center justify-center rounded-full text-sm font-bold ${profile.accent}`}>
                  {profile.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">{profile.name}</p>
                  <p className="text-xs text-muted">{profile.niche}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold text-muted">
                <span>{profile.followers}</span>
                <span className="flex items-center gap-1 text-brand-orange">
                  <Star className="size-3.5 fill-current" />
                  {profile.rating}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            See exactly who you&apos;re working with
          </h2>
          <p className="mt-4 text-base text-muted">
            Every influencer profile on Reachly shows verified follower counts, engagement rate,
            and past campaign performance across Instagram, TikTok, and YouTube — so brands can
            decide with confidence.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/signup">
              <Button variant="primary" fullWidth={false} className="px-8">
                Sign Up as a Brand
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="ghost" fullWidth={false} className="px-8">
                Sign Up as an Influencer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
