"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/rbac";
import type { ActionResult } from "@/lib/actions/campaigns";

const updateNameSchema = z.object({ name: z.string().min(1).max(120) });

export async function updateAccountNameAction(input: unknown): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = updateNameSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await prisma.user.update({ where: { id: user.id }, data: { name: parsed.data.name } });
  return { success: true };
}

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation don't match",
    path: ["confirmPassword"],
  });

export async function changePasswordAction(input: unknown): Promise<ActionResult> {
  const sessionUser = await requireUser();

  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user?.passwordHash) {
    return { success: false, error: "This account has no password set." };
  }

  const isValid = await bcrypt.compare(parsed.data.oldPassword, user.passwordHash);
  if (!isValid) {
    return { success: false, error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  return { success: true };
}
