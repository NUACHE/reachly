import type { TeamMemberRole } from "@/generated/prisma/client";

export const ROLE_OPTIONS: { value: TeamMemberRole; label: string }[] = [
  { value: "OWNER", label: "Owner" },
  { value: "ADMIN", label: "Admin" },
  { value: "EDITOR", label: "Editor" },
  { value: "VIEWER", label: "Viewer" },
];

export function roleLabel(role: TeamMemberRole) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}
