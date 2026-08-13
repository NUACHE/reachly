import type { ReactNode } from "react";
import { Bell, ClipboardList, Compass, LayoutDashboard, User } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { requireRoleForPage } from "@/lib/rbac";

const NAV_ITEMS = [
  { label: "Home", href: "/influencer", icon: <LayoutDashboard size={18} /> },
  { label: "Campaigns", href: "/influencer/campaigns", icon: <Compass size={18} /> },
  { label: "My Applications", href: "/influencer/applications", icon: <ClipboardList size={18} /> },
  { label: "Alerts", href: "/influencer/alerts", icon: <Bell size={18} /> },
  { label: "Profile", href: "/influencer/profile", icon: <User size={18} /> },
];

export default async function InfluencerLayout({ children }: { children: ReactNode }) {
  await requireRoleForPage("INFLUENCER");

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar navItems={NAV_ITEMS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
