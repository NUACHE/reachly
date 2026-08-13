interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-6 w-9 shrink-0 items-center">
        <span className="absolute left-0 size-6 rounded-full bg-brand-blue" />
        <span className="absolute left-3 size-6 rounded-full bg-brand-orange" />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink">Reachly</span>
    </span>
  );
}
