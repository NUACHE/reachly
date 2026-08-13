"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { BlueModal } from "@/components/ui/blue-modal";
import { Button } from "@/components/ui/button";

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutConfirmModal({ open, onClose }: LogoutConfirmModalProps) {
  return (
    <BlueModal open={open} onClose={onClose} title="Confirm Logout" maxWidth="max-w-sm">
      <div className="flex flex-col items-center gap-5 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <LogOut size={26} />
        </span>
        <p className="text-sm font-medium text-ink">Are you sure you want to logout?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth={false} className="px-8" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth={false} className="px-8" onClick={() => signOut({ callbackUrl: "/login" })}>
            Ok
          </Button>
        </div>
      </div>
    </BlueModal>
  );
}
