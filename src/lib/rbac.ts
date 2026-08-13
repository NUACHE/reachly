import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/generated/prisma/client";

const ROLE_HOME: Record<Role, string> = {
  BRAND: "/brand",
  INFLUENCER: "/influencer",
  ADMIN: "/admin",
};

/**
 * Per Next.js guidance, Proxy alone is not a sufficient auth boundary (a matcher
 * change can silently stop covering a route). Every Server Action / Route Handler
 * that mutates or reads privileged data must call one of these directly.
 */
export class UnauthorizedError extends Error {
  status = 401;
}

export class ForbiddenError extends Error {
  status = 403;
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError("Authentication required");
  return session.user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) throw new ForbiddenError("Insufficient permissions");
  return user;
}

/**
 * For Server Components (pages/layouts) only. Redirects instead of throwing —
 * mirrors proxy.ts's checks as a second line of defence, since the guidance in
 * Next's own docs is that Proxy coverage can silently regress after a refactor.
 */
export async function requireRoleForPage(...roles: Role[]) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!roles.includes(session.user.role)) redirect(ROLE_HOME[session.user.role]);
  return session.user;
}
