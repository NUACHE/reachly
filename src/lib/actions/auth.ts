"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";

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
