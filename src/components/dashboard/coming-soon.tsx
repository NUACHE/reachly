import { Topbar } from "@/components/dashboard/topbar";

interface ComingSoonProps {
  title: string;
  description: string;
}

/** Tier 2 placeholder — UI slot reserved by the design, backend deferred (see Technical_Debt_Plan). */
export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div>
      <Topbar title={title} />
      <div className="p-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-subtle bg-white px-6 py-20 text-center">
          <p className="text-lg font-semibold text-ink">Coming soon</p>
          <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}
