"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema, completeGoogleSignupSchema } from "@/lib/validation";
import { verifyGoogleSignupToken } from "@/lib/auth-tokens";

export interface SignUpResult {
  success: boolean;
  error?: string;
}

export async function signUpAction(input: unknown): Promise<SignUpResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  if (data.role === "BRAND") {
    await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: "BRAND",
        brandProfile: {
          create: {
            companyName: data.companyName,
            website: data.website || null,
          },
        },
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: "INFLUENCER",
        influencerProfile: {
          create: {
            displayName: data.displayName,
            niches: data.niches,
            followerCount: data.followerCount,
            engagementRate: data.engagementRate,
            portfolioLinks: [],
          },
        },
      },
    });
  }

  return { success: true };
}

/** Finishes a Google sign-in for a brand-new email: picks role/profile, then the caller re-triggers signIn("google"). */
export async function completeGoogleSignupAction(input: unknown): Promise<SignUpResult> {
  const parsed = completeGoogleSignupSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const data = parsed.data;
  const verified = verifyGoogleSignupToken(data.token);
  if (!verified) {
    return { success: false, error: "This signup link has expired. Please continue with Google again." };
  }

  const existing = await prisma.user.findUnique({ where: { email: verified.email } });
  if (existing) {
    return { success: false, error: "An account with this email already exists." };
  }

  if (data.role === "BRAND") {
    await prisma.user.create({
      data: {
        email: verified.email,
        name: verified.name || null,
        role: "BRAND",
        brandProfile: { create: { companyName: data.companyName, website: data.website || null } },
      },
    });
  } else {
    await prisma.user.create({
      data: {
        email: verified.email,
        name: verified.name || null,
        role: "INFLUENCER",
        influencerProfile: {
          create: {
            displayName: data.displayName,
            niches: data.niches,
            followerCount: data.followerCount,
            engagementRate: data.engagementRate,
            portfolioLinks: [],
          },
        },
      },
    });
  }

  return { success: true };
}
