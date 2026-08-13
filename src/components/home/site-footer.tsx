import Link from "next/link";
import { Logo } from "@/components/logo";

const FOOTER_COLUMNS = [
  {
    title: "For Brands",
    links: [
      { label: "Features", href: "#brands" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Get Started", href: "/signup" },
    ],
  },
  {
    title: "For Influencers",
    links: [
      { label: "Become an Influencer", href: "/signup" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Success Stories", href: "#testimonials" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#1e1e1e] pt-16 pb-8 text-white/70">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm">
              A self-service platform connecting brands and online influencers.
            </p>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold text-white">{column.title}</h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Reachly. All rights reserved.</p>
          <p>Terms &amp; Conditions · Privacy Policy</p>
        </div>
      </div>
    </footer>
  );
}
