import type { ReactNode } from "react";
import { LayoutDashboard, Megaphone, Users, UsersRound } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { requireRoleForPage } from "@/lib/rbac";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/brand", icon: <LayoutDashboard size={20} /> },
  { label: "Campaigns", href: "/brand/campaigns", icon: <Megaphone size={20} /> },
  { label: "Influencers", href: "/brand/influencers", icon: <Users size={20} /> },
  { label: "Team", href: "/brand/team", icon: <UsersRound size={20} /> },
];

export default async function BrandLayout({ children }: { children: ReactNode }) {
  await requireRoleForPage("BRAND");

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar navItems={NAV_ITEMS} cta={{ label: "New Campaign", href: "/brand/campaigns/new" }} settingsHref="/brand/account" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
