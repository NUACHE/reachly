import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#top", label: "Home" },
  { href: "#brands", label: "For Brands" },
  { href: "#influencers", label: "For Influencers" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="#top">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink transition hover:text-brand-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link href="/login">
          <Button variant="primary" fullWidth={false} className="px-7 py-2.5">
            Log In
          </Button>
        </Link>
      </div>
    </header>
  );
}
