const STATUS_STYLES: Record<string, string> = {
  OPEN: "bg-brand-blue/10 text-brand-blue",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-gray-100 text-gray-600",
  COMPLETED: "bg-brand-orange/10 text-brand-orange",
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  const classes = STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase ${classes}`}
    >
      {status}
    </span>
  );
}
