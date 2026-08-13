import type { ReactNode } from "react";

interface TopbarProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function Topbar({ title, description, action }: TopbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle bg-white px-8 py-6">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
