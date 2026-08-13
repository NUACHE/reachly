import type { ReactNode } from "react";
import { Megaphone, Users } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { requireRoleForPage } from "@/lib/rbac";

const NAV_ITEMS = [
  { label: "Users", href: "/admin", icon: <Users size={18} /> },
  { label: "Campaigns", href: "/admin/campaigns", icon: <Megaphone size={18} /> },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireRoleForPage("ADMIN");

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar navItems={NAV_ITEMS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
