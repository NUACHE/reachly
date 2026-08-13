"use server";

import { revalidatePath } from "next/cache";
import { DEMO_MODE, DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/lib/actions/campaigns";

export async function toggleUserSuspensionAction(userId: string): Promise<ActionResult> {
  await requireRole("ADMIN");

  if (DEMO_MODE) {
    const account = DEMO_ACCOUNTS.find((a) => a.id === userId);
    if (!account) return { success: false, error: "User not found." };
    if (account.role === "ADMIN") return { success: false, error: "Cannot suspend an admin account." };

    account.suspended = !account.suspended;
    revalidatePath("/admin");
    return { success: true };
  }

  throw new Error("Live database not yet connected — see Technical_Debt_Plan DEBT-01");
}

export async function removeCampaignAction(campaignId: string): Promise<ActionResult> {
  await requireRole("ADMIN");

  if (DEMO_MODE) {
    const index = MOCK_CAMPAIGNS.findIndex((c) => c.id === campaignId);
    if (index === -1) return { success: false, error: "Campaign not found." };

    MOCK_CAMPAIGNS.splice(index, 1);
    revalidatePath("/admin/campaigns");
    revalidatePath("/brand/campaigns");
    return { success: true };
  }

  throw new Error("Live database not yet connected — see Technical_Debt_Plan DEBT-01");
}
