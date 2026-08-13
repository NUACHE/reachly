"use client";

import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteModalProps {
  open: boolean;
  heading: string;
  description: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ open, heading, description, confirmLabel = "Delete", onCancel, onConfirm }: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-muted transition hover:bg-[#f8f9fb]"
        >
          <X size={16} />
        </button>

        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
          <Trash2 size={24} />
        </span>

        <h2 className="text-sm font-semibold text-ink">{heading}</h2>
        <p className="mt-2 text-xs text-muted">{description}</p>

        <div className="mt-6 flex justify-center gap-3">
          <Button variant="secondary" fullWidth={false} className="px-6" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" fullWidth={false} className="px-6" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
