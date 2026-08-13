import type { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "@/components/logo";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  eyebrow?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer, eyebrow }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <Image
        src="/images/auth-background.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/60 to-brand-orange/40" />

      <div className="relative z-10 w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl sm:p-10">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {eyebrow}

        <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>

        <div className="mt-6">{children}</div>

        {footer ? <p className="mt-6 text-center text-sm text-ink">{footer}</p> : null}
      </div>
    </div>
  );
}
