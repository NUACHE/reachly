"use server";

import { revalidatePath } from "next/cache";
import { brandProfileSchema, inviteTeamMemberSchema, removeTeamMembersSchema, updateTeamMemberSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";
import type { ActionResult } from "@/lib/actions/campaigns";

async function requireBrandId(userId: string) {
  const brand = await prisma.brandProfile.findUnique({ where: { userId } });
  if (!brand) throw new Error("Brand profile not found for this account.");
  return brand.id;
}

export async function updateBrandProfileAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = brandProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.brandProfile.update({
    where: { userId: user.id },
    data: { companyName: parsed.data.companyName, website: parsed.data.website || null },
  });

  revalidatePath("/brand/team");
  revalidatePath("/brand");
  return { success: true };
}

export async function inviteTeamMemberAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = inviteTeamMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const brandId = await requireBrandId(user.id);
  const existing = await prisma.teamMember.findUnique({ where: { brandId_email: { brandId, email: parsed.data.email } } });
  if (existing) return { success: false, error: "This email has already been invited." };

  await prisma.teamMember.create({
    data: {
      brandId,
      name: parsed.data.email.split("@")[0],
      email: parsed.data.email,
      role: parsed.data.role,
      invited: true,
    },
  });

  revalidatePath("/brand/team");
  return { success: true };
}

export async function updateTeamMemberAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = updateTeamMemberSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const brandId = await requireBrandId(user.id);
  const member = await prisma.teamMember.findUnique({ where: { id: parsed.data.teamMemberId } });
  if (!member || member.brandId !== brandId) return { success: false, error: "Team member not found." };

  await prisma.teamMember.update({ where: { id: parsed.data.teamMemberId }, data: { role: parsed.data.role } });

  revalidatePath("/brand/team");
  return { success: true };
}

export async function removeTeamMembersAction(input: unknown): Promise<ActionResult> {
  const user = await requireRole("BRAND");

  const parsed = removeTeamMembersSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const brandId = await requireBrandId(user.id);
  await prisma.teamMember.deleteMany({ where: { id: { in: parsed.data.teamMemberIds }, brandId } });

  revalidatePath("/brand/team");
  return { success: true };
}
