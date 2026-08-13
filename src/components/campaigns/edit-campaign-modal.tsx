"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BlueModal } from "@/components/ui/blue-modal";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { Button } from "@/components/ui/button";
import { updateCampaignAction } from "@/lib/actions/campaigns";

interface EditCampaignModalProps {
  open: boolean;
  campaignId: string;
  initialTitle: string;
  initialDescription: string;
  onClose: () => void;
}

export function EditCampaignModal({ open, campaignId, initialTitle, initialDescription, onClose }: EditCampaignModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await updateCampaignAction({ campaignId, title, description });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <BlueModal open={open} onClose={onClose} title="Edit Campaign">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextField label="Title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <TextareaField label="Description" name="description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Done"}
        </Button>
      </form>
    </BlueModal>
  );
}
