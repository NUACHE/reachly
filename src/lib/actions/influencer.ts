"use server";

import { revalidatePath } from "next/cache";
import { applicationSchema, influencerProfileSchema } from "@/lib/validation";
import { computeMatchScore } from "@/lib/matching";
import { prisma } from "@/lib/prisma";
import { getCurrentInfluencerProfile } from "@/lib/data/influencer";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/lib/actions/campaigns";

export async function applyToCampaignAction(input: unknown): Promise<ActionResult> {
  await requireRole("INFLUENCER");

  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { campaignId, note } = parsed.data;

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return { success: false, error: "Campaign not found." };

  const influencer = await getCurrentInfluencerProfile();

  const alreadyApplied = await prisma.application.findUnique({
    where: { campaignId_influencerId: { campaignId, influencerId: influencer.id } },
  });
  if (alreadyApplied) return { success: false, error: "You've already applied to this campaign." };

  await prisma.application.create({
    data: {
      campaignId,
      influencerId: influencer.id,
      note: note ?? "",
      matchScore: computeMatchScore({
        campaignNiches: campaign.niches,
        influencerNiches: influencer.niches,
        minFollowers: campaign.minFollowers,
        maxFollowers: campaign.maxFollowers,
        followerCount: influencer.followerCount,
        engagementRate: influencer.engagementRate,
      }),
      status: "PENDING",
    },
  });

  revalidatePath("/influencer");
  revalidatePath("/influencer/campaigns");
  revalidatePath("/influencer/applications");
  revalidatePath(`/brand/campaigns/${campaignId}`);
  return { success: true, campaignId };
}

export async function updateInfluencerProfileAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("INFLUENCER");

  const parsed = influencerProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.influencerProfile.update({
    where: { userId: user.id },
    data: {
      displayName: parsed.data.displayName,
      bio: parsed.data.bio,
      niches: parsed.data.niches,
      followerCount: parsed.data.followerCount,
      engagementRate: parsed.data.engagementRate,
    },
  });

  revalidatePath("/influencer/profile");
  revalidatePath("/influencer");
  revalidatePath("/influencer/campaigns");
  return { success: true };
}
