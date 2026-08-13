import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-orange text-white hover:brightness-95",
  secondary: "bg-brand-blue text-white hover:brightness-95",
  ghost: "border border-border-subtle bg-white text-ink hover:bg-[#f8f8f8]",
};

export function Button({
  variant = "primary",
  fullWidth = true,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full py-3.5 text-sm font-bold tracking-wide uppercase transition disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
