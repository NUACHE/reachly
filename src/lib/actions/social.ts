"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { syncYoutubeAccount } from "@/lib/social";
import type { ActionResult } from "@/lib/actions/campaigns";

async function requireOwnedAccount(accountId: string) {
  const user = await requireRole("INFLUENCER");
  const influencer = await prisma.influencerProfile.findUniqueOrThrow({ where: { userId: user.id } });
  const account = await prisma.socialAccount.findUnique({ where: { id: accountId } });
  if (!account || account.influencerId !== influencer.id) return null;
  return account;
}

export async function disconnectSocialAccountAction(accountId: string): Promise<ActionResult> {
  const account = await requireOwnedAccount(accountId);
  if (!account) return { success: false, error: "Account not found." };

  await prisma.socialAccount.delete({ where: { id: accountId } });
  revalidatePath("/influencer/profile");
  return { success: true };
}

export async function syncSocialAccountAction(accountId: string): Promise<ActionResult> {
  const account = await requireOwnedAccount(accountId);
  if (!account) return { success: false, error: "Account not found." };
  if (account.platform !== "YOUTUBE") return { success: false, error: "Syncing isn't available for this platform yet." };

  try {
    await syncYoutubeAccount(accountId);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Sync failed." };
  }

  revalidatePath("/influencer/profile");
  return { success: true };
}
