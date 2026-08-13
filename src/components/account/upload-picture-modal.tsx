"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud } from "lucide-react";
import { BlueModal } from "@/components/ui/blue-modal";
import { Button } from "@/components/ui/button";

interface UploadPictureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (previewUrl: string | null) => void;
}

export function UploadPictureModal({ open, onClose, onSave }: UploadPictureModalProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <BlueModal open={open} onClose={onClose} title="Upload Profile Picture">
      <div className="flex flex-col items-center gap-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border-subtle bg-[#f8f9fb] text-center transition hover:border-brand-blue"
        >
          {preview ? (
            <Image src={preview} alt="Profile picture preview" width={96} height={96} className="size-24 rounded-full object-cover" unoptimized />
          ) : (
            <>
              <span className="text-sm text-ink">Click Here or Drop File to Upload</span>
              <UploadCloud size={20} className="text-brand-blue" />
            </>
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <Button
          fullWidth={false}
          className="px-10"
          onClick={() => {
            onSave(preview);
            onClose();
          }}
        >
          Done
        </Button>
      </div>
    </BlueModal>
  );
}
