"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { NicheSelector } from "@/components/ui/niche-selector";
import { Button } from "@/components/ui/button";
import { updateInfluencerProfileAction } from "@/lib/actions/influencer";
import type { MockInfluencer } from "@/lib/mock-data";

export function InfluencerProfileForm({ profile }: { profile: MockInfluencer }) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio);
  const [niches, setNiches] = useState<string[]>(profile.niches);
  const [followerCount, setFollowerCount] = useState(String(profile.followerCount));
  const [engagementRate, setEngagementRate] = useState(String(profile.engagementRate));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const result = await updateInfluencerProfileAction({
      displayName,
      bio,
      niches,
      followerCount: Number(followerCount),
      engagementRate: Number(engagementRate),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  return (
    <form className="flex max-w-xl flex-col gap-5" onSubmit={handleSubmit}>
      <div className="rounded-lg border border-dashed border-border-subtle bg-[#f8f9fb] px-4 py-3 text-xs text-muted">
        These fields are self-reported. For verified stats, connect a YouTube account under
        the &quot;Connected Accounts&quot; tab.
      </div>

      <TextField
        label="Display Name"
        name="displayName"
        required
        value={displayName}
        onChange={(event) => setDisplayName(event.target.value)}
      />

      <TextareaField
        label="Bio"
        name="bio"
        rows={3}
        value={bio}
        onChange={(event) => setBio(event.target.value)}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-ink">Your Niches (pick up to 3)</span>
        <NicheSelector value={niches} onChange={setNiches} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TextField
          label="Follower Count"
          name="followerCount"
          type="number"
          min={0}
          required
          value={followerCount}
          onChange={(event) => setFollowerCount(event.target.value)}
        />
        <TextField
          label="Engagement Rate (%)"
          name="engagementRate"
          type="number"
          min={0}
          max={100}
          step="0.1"
          required
          value={engagementRate}
          onChange={(event) => setEngagementRate(event.target.value)}
        />
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      {success ? <p className="text-xs text-emerald-600">Profile updated.</p> : null}

      <Button type="submit" fullWidth={false} className="px-8" disabled={isSubmitting || niches.length === 0}>
        {isSubmitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
