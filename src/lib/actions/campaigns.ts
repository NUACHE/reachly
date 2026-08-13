"use server";

import { revalidatePath } from "next/cache";
import { campaignSchema, applicationDecisionSchema, updateCampaignSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import { computeMatchScore } from "@/lib/matching";

export interface ActionResult {
  success: boolean;
  error?: string;
  campaignId?: string;
}

export async function createCampaignAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = campaignSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const brand = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
  if (!brand) return { success: false, error: "Brand profile not found for this account." };

  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      title: data.title,
      description: data.description,
      objective: data.objective,
      niches: data.niches,
      minFollowers: data.minFollowers,
      maxFollowers: data.maxFollowers,
      budget: data.budget,
      deliverables: data.deliverables,
      status: "OPEN",
      deadline: data.deadline,
      kpis: data.kpis ?? [],
      dos: data.dos ?? [],
      donts: data.donts ?? [],
      hashtags: data.hashtags ?? [],
      postingSchedule: data.postingSchedule ?? undefined,
    },
  });

  if (data.invitedInfluencerIds?.length) {
    const influencers = await prisma.influencerProfile.findMany({ where: { id: { in: data.invitedInfluencerIds } } });
    await prisma.application.createMany({
      data: influencers.map((influencer) => ({
        campaignId: campaign.id,
        influencerId: influencer.id,
        note: "Invited by brand",
        matchScore: computeMatchScore({
          campaignNiches: campaign.niches,
          influencerNiches: influencer.niches,
          minFollowers: campaign.minFollowers,
          maxFollowers: campaign.maxFollowers,
          followerCount: influencer.followerCount,
          engagementRate: influencer.engagementRate,
        }),
        status: "PENDING",
      })),
      skipDuplicates: true,
    });

    await prisma.notification.createMany({
      data: influencers.map((influencer) => ({
        userId: influencer.userId,
        type: "CAMPAIGN_INVITE" as const,
        title: "New campaign invite",
        message: `You've been invited to join "${campaign.title}".`,
        link: `/influencer/campaigns/${campaign.id}`,
      })),
    });
  }

  revalidatePath("/brand/campaigns");
  revalidatePath("/brand");
  return { success: true, campaignId: campaign.id };
}

export async function updateCampaignAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = updateCampaignSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { campaignId, title, description } = parsed.data;

  const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return { success: false, error: "Campaign not found." };

  const brand = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
  if (!brand || campaign.brandId !== brand.id) return { success: false, error: "Campaign not found." };

  await prisma.campaign.update({ where: { id: campaignId }, data: { title, description } });

  revalidatePath(`/brand/campaigns/${campaignId}`);
  revalidatePath("/brand/campaigns");
  return { success: true, campaignId };
}

export async function decideApplicationAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = applicationDecisionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { applicationId, decision } = parsed.data;

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { campaign: true, influencer: { select: { userId: true } } },
  });
  if (!application) return { success: false, error: "Application not found." };

  const brand = await prisma.brandProfile.findUnique({ where: { userId: user.id } });
  if (!brand || application.campaign.brandId !== brand.id) return { success: false, error: "Application not found." };

  await prisma.application.update({
    where: { id: applicationId },
    data: { status: decision, decidedAt: new Date() },
  });

  await prisma.notification.create({
    data: {
      userId: application.influencer.userId,
      type: decision === "ACCEPTED" ? "APPLICATION_ACCEPTED" : "APPLICATION_REJECTED",
      title: decision === "ACCEPTED" ? "Application accepted" : "Application declined",
      message:
        decision === "ACCEPTED"
          ? `Your application to "${application.campaign.title}" was accepted.`
          : `Your application to "${application.campaign.title}" was declined.`,
      link: `/influencer/campaigns/${application.campaignId}`,
    },
  });

  revalidatePath(`/brand/campaigns/${application.campaignId}`);
  return { success: true };
}
