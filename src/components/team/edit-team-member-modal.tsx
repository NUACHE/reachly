"use client";

import { useEffect, useState } from "react";
import { BlueModal } from "@/components/ui/blue-modal";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS } from "@/components/team/team-role";
import type { TeamMember, TeamMemberRole } from "@/generated/prisma/client";

interface EditTeamMemberModalProps {
  open: boolean;
  member: TeamMember | null;
  onClose: () => void;
  onSave: (role: TeamMemberRole) => void;
}

export function EditTeamMemberModal({ open, member, onClose, onSave }: EditTeamMemberModalProps) {
  const [role, setRole] = useState<TeamMemberRole>("EDITOR");

  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  return (
    <BlueModal open={open && !!member} onClose={onClose} title="Edit Team Member">
      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(role);
        }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-role" className="text-sm font-medium text-ink">
            Role
          </label>
          <select
            id="edit-role"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamMemberRole)}
            className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-sm text-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" fullWidth={false} className="self-center px-10">
          Edit Member
        </Button>
      </form>
    </BlueModal>
  );
}
