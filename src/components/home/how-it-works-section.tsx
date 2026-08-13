import { Play } from "lucide-react";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue to-brand-orange">
          <button
            type="button"
            aria-label="Watch how Reachly works"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-brand-blue shadow-lg transition hover:bg-white">
              <Play className="size-6 fill-current" />
            </span>
          </button>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Reach. Influence. Power.</h2>
          <p className="mt-4 text-base text-muted">
            Reachly gives brands a self-serve way to discover creators, launch campaigns, and
            manage applications end-to-end — without relying on agencies or spreadsheets.
          </p>
          <p className="mt-4 text-base text-muted">
            For influencers, it means one dashboard to apply to campaigns, connect your social
            accounts, and get paid — all backed by transparent, verified stats.
          </p>
        </div>
      </div>
    </section>
  );
}
