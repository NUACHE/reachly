"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { updateBrandProfileAction } from "@/lib/actions/brand";

interface BrandProfileFormProps {
  companyName: string;
  website: string | null;
}

export function BrandProfileForm({ companyName, website }: BrandProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(companyName);
  const [site, setSite] = useState(website ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSaved(false);

    const result = await updateBrandProfileAction({ companyName: name, website: site });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form className="flex max-w-lg flex-col gap-5 rounded-2xl border border-border-subtle bg-white p-6" onSubmit={handleSubmit}>
      <h2 className="text-sm font-semibold text-ink">Brand Profile</h2>
      <TextField label="Company Name" name="companyName" required value={name} onChange={(e) => setName(e.target.value)} />
      <TextField label="Website" name="website" type="url" placeholder="https://" value={site} onChange={(e) => setSite(e.target.value)} />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-emerald-600">Brand profile updated.</p> : null}
      <Button type="submit" fullWidth={false} className="px-8" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Update"}
      </Button>
    </form>
  );
}
