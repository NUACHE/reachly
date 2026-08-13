import { BarChart3, ShieldCheck, Users } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Users,
    title: "Find the Right Fit",
    description: "Reach audiences that actually match your brand's niche, tone, and goals.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Creators",
    description:
      "Every profile is backed by connected social accounts, so the stats you see are the real thing.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Reporting",
    description: "Track campaign performance live — no spreadsheets, no chasing screenshots.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 text-center">
      <h2 className="mx-auto max-w-2xl text-3xl font-extrabold text-ink sm:text-4xl">
        A self-service platform connecting brands and online influencers
      </h2>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {VALUE_PROPS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-2xl bg-[#f8f8f8] p-8 text-left">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-blue text-white">
              <Icon className="size-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
