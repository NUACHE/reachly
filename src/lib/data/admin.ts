import { prisma } from "@/lib/prisma";
import { toMockCampaign } from "@/lib/data/campaigns";
import type { Role } from "@/generated/prisma/client";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  suspended: boolean;
}

/** Real, database-backed platform oversight (SRS FR-F1) — no demo-mode branching, so it reflects every account that has actually signed up. */
export async function getAllUsers(): Promise<AdminUserRow[]> {
  const users = await prisma.user.findMany({
    include: { brandProfile: true, influencerProfile: true },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.brandProfile?.companyName ?? user.influencerProfile?.displayName ?? user.name ?? user.email,
    email: user.email,
    role: user.role,
    suspended: user.suspended,
  }));
}

export async function getAllCampaignsAdmin() {
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  return campaigns.map(toMockCampaign);
}
