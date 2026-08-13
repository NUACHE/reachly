"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut, PlusCircle, Settings } from "lucide-react";
import { Logo } from "@/components/logo";

export interface SidebarNavItem {
  label: string;
  href: string;
  /** A rendered icon element (e.g. `<LayoutDashboard size={20} />`), not a component
   *  reference — Server Components can only pass plain objects/elements to Client
   *  Components, and a component reference isn't serializable across that boundary. */
  icon: ReactNode;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  cta?: { label: string; href: string };
  settingsHref?: string;
}

export function Sidebar({ navItems, cta, settingsHref }: SidebarProps) {
  const pathname = usePathname();

  // Pick the most specific (longest) matching href so a parent route (e.g. "/brand")
  // doesn't also light up when a sibling route (e.g. "/brand/campaigns") is active.
  const activeHref = navItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-border-subtle bg-white">
      <div className="flex items-center justify-between gap-2 px-6 py-6">
        <Logo />
        {settingsHref ? (
          <Link
            href={settingsHref}
            aria-label="Account settings"
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition ${
              pathname.startsWith(settingsHref) ? "bg-brand-orange/10 text-brand-orange" : "text-muted hover:bg-[#f8f8f8]"
            }`}
          >
            <Settings size={17} />
          </Link>
        ) : null}
      </div>

      {cta ? (
        <div className="px-4 pb-4">
          <Link
            href={cta.href}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand-blue py-3 text-xs font-semibold text-white transition hover:brightness-95"
          >
            <PlusCircle size={18} />
            {cta.label}
          </Link>
        </div>
      ) : null}

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => {
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium transition ${
                active ? "bg-brand-orange/10 text-brand-orange" : "text-ink hover:bg-[#f8f8f8]"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-6">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-medium text-ink hover:bg-[#f8f8f8]"
        >
          <LogOut size={20} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
