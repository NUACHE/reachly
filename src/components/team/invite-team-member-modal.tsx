"use client";

import { useState } from "react";
import { BlueModal } from "@/components/ui/blue-modal";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS } from "@/components/team/team-role";
import type { TeamMemberRole } from "@/generated/prisma/client";

interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (values: { email: string; role: TeamMemberRole }) => void;
}

export function InviteTeamMemberModal({ open, onClose, onInvite }: InviteTeamMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamMemberRole>("EDITOR");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onInvite({ email, role });
    setEmail("");
    setRole("EDITOR");
  }

  return (
    <BlueModal open={open} onClose={onClose} title="Invite Team Member">
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <TextField label="Email" name="email" type="email" required placeholder="teammate@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="invite-role" className="text-sm font-medium text-ink">
            Role
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as TeamMemberRole)}
            className="w-full rounded-lg border border-border-subtle bg-white px-4 py-3 text-sm text-ink focus:border-brand-blue focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            {ROLE_OPTIONS.filter((option) => option.value !== "OWNER").map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" fullWidth={false} className="self-center px-10">
          Send Invite
        </Button>
      </form>
    </BlueModal>
  );
}
