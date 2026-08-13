import { z } from "zod";
import { NICHES } from "@/lib/niches";

const nicheField = z.enum(NICHES);

export const brandSignupSchema = z.object({
  role: z.literal("BRAND"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
});

export const influencerSignupSchema = z.object({
  role: z.literal("INFLUENCER"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  displayName: z.string().min(2),
  niches: z.array(nicheField).min(1).max(3),
  followerCount: z.coerce.number().int().min(0),
  engagementRate: z.coerce.number().min(0).max(100),
});

export const signupSchema = z.discriminatedUnion("role", [
  brandSignupSchema,
  influencerSignupSchema,
]);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const campaignSchema = z
  .object({
    title: z.string().min(3).max(120),
    description: z.string().min(10).max(2000),
    objective: z.enum(["AWARENESS", "ENGAGEMENT", "PRODUCT"]),
    niches: z.array(nicheField).min(1).max(3),
    minFollowers: z.coerce.number().int().min(0),
    maxFollowers: z.coerce.number().int().min(0),
    budget: z.coerce.number().int().min(0),
    deliverables: z.string().min(5).max(1000),
    deadline: z.coerce.date(),
    kpis: z.array(z.string()).optional(),
    dos: z.array(z.string()).optional(),
    donts: z.array(z.string()).optional(),
    hashtags: z.array(z.string()).optional(),
    postingSchedule: z.array(z.object({ platform: z.string(), count: z.number(), frequency: z.string() })).optional(),
    invitedInfluencerIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.maxFollowers >= data.minFollowers, {
    message: "Maximum followers must be greater than or equal to minimum followers",
    path: ["maxFollowers"],
  });

export const updateCampaignSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
});

export const applicationSchema = z.object({
  campaignId: z.string().min(1),
  note: z.string().max(500).optional(),
});

export const applicationDecisionSchema = z.object({
  applicationId: z.string().min(1),
  decision: z.enum(["ACCEPTED", "REJECTED"]),
});

export const brandProfileSchema = z.object({
  companyName: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
});

export const inviteTeamMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
});

export const updateTeamMemberSchema = z.object({
  teamMemberId: z.string().min(1),
  role: z.enum(["OWNER", "ADMIN", "EDITOR", "VIEWER"]),
});

export const removeTeamMembersSchema = z.object({
  teamMemberIds: z.array(z.string().min(1)).min(1),
});

export const influencerProfileSchema = z.object({
  displayName: z.string().min(2),
  bio: z.string().max(500).optional(),
  niches: z.array(nicheField).min(1).max(3),
  followerCount: z.coerce.number().int().min(0),
  engagementRate: z.coerce.number().min(0).max(100),
  portfolioLinks: z.array(z.string().url()).max(5).optional(),
});
