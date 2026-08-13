import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

const ROLE_HOME: Record<Role, string> = {
  BRAND: "/brand",
  INFLUENCER: "/influencer",
  ADMIN: "/admin",
};

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  redirect(ROLE_HOME[session.user.role]);
}
