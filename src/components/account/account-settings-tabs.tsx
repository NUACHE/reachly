"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { updateAccountNameAction } from "@/lib/actions/account";
import { initialsFor } from "@/lib/initials";

const TABS = ["Profile", "Change Password"] as const;

interface AccountSettingsTabsProps {
  name: string;
  email: string;
}

export function AccountSettingsTabs({ name, email }: AccountSettingsTabsProps) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Profile");

  const [firstName, setFirstName] = useState(name.split(" ")[0] ?? name);
  const [lastName, setLastName] = useState(name.split(" ").slice(1).join(" "));
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileSaved(false);
    setProfileError(null);

    const result = await updateAccountNameAction({ name: `${firstName} ${lastName}`.trim() });

    if (!result.success) {
      setProfileError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    setProfileSaved(true);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border-subtle bg-white">
      <div className="flex gap-6 border-b border-border-subtle px-6">
        {TABS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={`-mb-px border-b-2 px-1 py-4 text-xs font-medium transition ${
              tab === option ? "border-brand-orange text-brand-orange" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "Profile" ? (
          <form className="flex max-w-lg flex-col gap-5" onSubmit={handleProfileSubmit}>
            <div className="flex items-center gap-4">
              <span className="flex size-16 items-center justify-center rounded-full bg-[#f0f1f5] text-lg font-semibold text-ink">
                {initialsFor(name)}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{name}</p>
                <p className="text-xs text-muted">{email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField label="First Name" name="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <TextField label="Last Name" name="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>

            <TextField label="Email Address" name="email" type="email" value={email} disabled />

            {profileError ? <p className="text-sm text-red-600">{profileError}</p> : null}
            {profileSaved ? <p className="text-sm text-emerald-600">Profile updated.</p> : null}

            <Button type="submit" fullWidth={false} className="px-8">
              Update
            </Button>
          </form>
        ) : null}

        {tab === "Change Password" ? <ChangePasswordForm /> : null}
      </div>
    </div>
  );
}
