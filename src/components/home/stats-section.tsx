const STATS = [
  { value: "90%", label: "of consumers trust peer recommendations over ads." },
  { value: "2x", label: "Word of mouth generates more than twice the sales of paid advertising." },
  { value: "50%", label: "of shoppers say user-generated content is more trustworthy than brand content." },
  { value: "15%", label: "Word of mouth amplifies the effect of paid media." },
];

export function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mx-auto max-w-2xl text-center text-3xl font-extrabold text-ink sm:text-4xl">
        Get the most out of your influencer marketing
      </h2>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {STATS.map((stat) => (
          <div
            key={stat.value}
            className="flex items-center gap-4 rounded-2xl border border-border-subtle p-6"
          >
            <span className="text-3xl font-extrabold text-brand-blue">{stat.value}</span>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
