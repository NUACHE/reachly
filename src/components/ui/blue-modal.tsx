"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";

interface BlueModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function BlueModal({ open, onClose, title, children, maxWidth = "max-w-md" }: BlueModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${maxWidth} overflow-hidden rounded-2xl bg-white shadow-xl`}>
        <div className="flex items-center justify-between bg-brand-blue px-6 py-4">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-white/80 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
