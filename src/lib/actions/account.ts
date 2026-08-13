"use server";

import { z } from "zod";
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
