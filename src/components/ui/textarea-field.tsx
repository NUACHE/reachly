import type { TextareaHTMLAttributes } from "react";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  error?: string;
}

export function TextareaField({ label, name, error, className = "", ...props }: TextareaFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={`w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue ${className}`}
        {...props}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
