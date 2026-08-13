"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/lib/actions/campaigns";

export async function toggleUserSuspensionAction(userId: string): Promise<ActionResult> {
  await requireRole("ADMIN");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { success: false, error: "User not found." };
  if (user.role === "ADMIN") return { success: false, error: "Cannot suspend an admin account." };

  await prisma.user.update({ where: { id: userId }, data: { suspended: !user.suspended } });
  revalidatePath("/admin");
  return { success: true };
}

export async function removeCampaignAction(campaignId: string): Promise<ActionResult> {
  await requireRole("ADMIN");

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return { success: false, error: "Campaign not found." };

  await prisma.campaign.delete({ where: { id: campaignId } });
  revalidatePath("/admin/campaigns");
  revalidatePath("/brand/campaigns");
  return { success: true };
}
