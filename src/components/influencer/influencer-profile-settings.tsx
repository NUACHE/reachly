"use client";

import { useState } from "react";
import {
  AlertCircle,
  Bell,
  Info,
  Lock,
  LogOut,
  Mail,
  Share2,
  User,
  Wallet as WalletIcon,
} from "lucide-react";
import { InfluencerProfileForm } from "@/components/profile/influencer-profile-form";
import { WalletTab } from "@/components/influencer/wallet-tab";
import { ConnectedAccountsTab, type YoutubeAccountView } from "@/components/influencer/connected-accounts-tab";
import { NotificationsTab, HelpCenterTab, AboutTab } from "@/components/influencer/settings-lists";
import { ChangePasswordForm } from "@/components/account/change-password-form";
import { LogoutConfirmModal } from "@/components/account/logout-confirm-modal";
import { TextField } from "@/components/ui/text-field";
import { Button } from "@/components/ui/button";
import type { MockInfluencer } from "@/lib/mock-data";

const NAV_ITEMS = [
  { key: "profile", label: "Edit Profile", icon: User },
  { key: "wallet", label: "Wallet", icon: WalletIcon },
  { key: "connected", label: "Connected Accounts", icon: Share2 },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "email", label: "Change Email", icon: Mail },
  { key: "help", label: "Get Help", icon: AlertCircle },
  { key: "password", label: "Change Password", icon: Lock },
  { key: "about", label: "About", icon: Info },
] as const;

type NavKey = (typeof NAV_ITEMS)[number]["key"] | "logout";

interface InfluencerProfileSettingsProps {
  profile: MockInfluencer;
  balance: number;
  earningEntries: { id: string; title: string }[];
  email: string;
  youtubeAccount: YoutubeAccountView | null;
  initialTab?: NavKey;
  socialError?: string | null;
}

export function InfluencerProfileSettings({
  profile,
  balance,
  earningEntries,
  email,
  youtubeAccount,
  initialTab,
  socialError,
}: InfluencerProfileSettingsProps) {
  const [tab, setTab] = useState<NavKey>(initialTab ?? "wallet");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [emailSaved, setEmailSaved] = useState(false);

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
        {tab === "wallet" ? <WalletTab balance={balance} entries={earningEntries} /> : null}
        {tab === "connected" ? <ConnectedAccountsTab youtubeAccount={youtubeAccount} socialError={socialError} /> : null}
        {tab === "notifications" ? <NotificationsTab /> : null}
        {tab === "email" ? (
          <form
            className="flex max-w-lg flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              setEmailSaved(true);
            }}
          >
            <TextField label="Email Address" name="email" type="email" required value={emailValue} onChange={(e) => setEmailValue(e.target.value)} />
            {emailSaved ? <p className="text-sm text-emerald-600">Email updated.</p> : null}
            <Button type="submit" fullWidth={false} className="px-8">
              Update Email
            </Button>
          </form>
        ) : null}
        {tab === "help" ? <HelpCenterTab /> : null}
        {tab === "password" ? <ChangePasswordForm /> : null}
        {tab === "about" ? <AboutTab /> : null}
      </div>

      <LogoutConfirmModal open={logoutOpen} onClose={() => setLogoutOpen(false)} />
    </div>
  );
}
