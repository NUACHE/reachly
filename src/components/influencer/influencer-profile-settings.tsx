"use client";

import { useState } from "react";
import { Award, Lock, LogOut, Share2, User } from "lucide-react";
import { InfluencerProfileForm } from "@/components/profile/influencer-profile-form";
import { PointsTab } from "@/components/influencer/points-tab";
import { ConnectedAccountsTab, type YoutubeAccountView } from "@/components/influencer/connected-accounts-tab";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { LogoutConfirmModal } from "@/components/account/logout-confirm-modal";
import type { MockInfluencer } from "@/lib/mock-data";

const NAV_ITEMS = [
  { key: "profile", label: "Edit Profile", icon: User },
  { key: "points", label: "Points", icon: Award },
  { key: "connected", label: "Connected Accounts", icon: Share2 },
  { key: "password", label: "Change Password", icon: Lock },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"] | "logout";

interface InfluencerProfileSettingsProps {
  profile: MockInfluencer;
  points: number;
  pointsEntries: { id: string; title: string; earnedAt: string }[];
  youtubeAccount: YoutubeAccountView | null;
  initialTab?: NavKey;
  socialError?: string | null;
}

export function InfluencerProfileSettings({
  profile,
  points,
  pointsEntries,
  youtubeAccount,
  initialTab,
  socialError,
}: InfluencerProfileSettingsProps) {
  const [tab, setTab] = useState<NavKey>(initialTab ?? "points");
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
      <nav className="flex flex-col gap-1 rounded-2xl border border-border-subtle bg-white p-3">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              tab === item.key ? "bg-brand-orange text-white" : "text-ink hover:bg-[#f8f9fb]"
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-[#f8f9fb]"
        >
          <LogOut size={16} />
          Log Out
        </button>
      </nav>

      <div>
        {tab === "profile" ? <InfluencerProfileForm profile={profile} /> : null}
        {tab === "points" ? <PointsTab points={points} entries={pointsEntries} /> : null}
        {tab === "connected" ? <ConnectedAccountsTab youtubeAccount={youtubeAccount} socialError={socialError} /> : null}
        {tab === "password" ? <ChangePasswordForm /> : null}
      </div>

      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
