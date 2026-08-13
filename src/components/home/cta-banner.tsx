import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EARNINGS_BARS = [40, 65, 50, 80, 60, 95];

export function CtaBanner() {
  return (
    <section id="brands" className="bg-brand-orange">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl leading-tight font-extrabold text-white sm:text-4xl">
            Join thousands of creators growing with Reachly
          </h2>
          <p className="mt-4 max-w-md text-base text-white/90 lg:mx-0">
            Turn your influence into income. Apply to campaigns that fit your niche and track
            every payout in one place.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button variant="ghost" fullWidth={false} className="px-9 py-4">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted">This Month&apos;s Earnings</p>
            <span className="flex items-center gap-1 text-xs font-bold text-green-600">
              <ArrowUpRight className="size-3.5" />
              18%
            </span>
          </div>
          <p className="mt-1 text-3xl font-extrabold text-ink">$2,480</p>

          <div className="mt-6 flex h-28 items-end gap-2">
            {EARNINGS_BARS.map((height, index) => (
              <span
                key={index}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-md ${
                  index === EARNINGS_BARS.length - 1 ? "bg-brand-orange" : "bg-brand-blue/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
