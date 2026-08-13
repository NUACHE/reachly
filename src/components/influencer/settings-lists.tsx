"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const NOTIFICATION_OPTIONS = [
  { key: "campaignInvites", label: "New campaign invitations" },
  { key: "postReviews", label: "Post review responses" },
  { key: "payments", label: "Payment and withdrawal alerts" },
  { key: "productUpdates", label: "Product updates and tips" },
];

export function NotificationsTab() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    campaignInvites: true,
    postReviews: true,
    payments: true,
    productUpdates: false,
  });

  return (
    <div className="flex max-w-lg flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-5">
      {NOTIFICATION_OPTIONS.map((option) => (
        <Checkbox
          key={option.key}
          label={option.label}
          checked={enabled[option.key]}
          onChange={(e) => setEnabled((prev) => ({ ...prev, [option.key]: e.target.checked }))}
        />
      ))}
    </div>
  );
}

const HELP_TOPICS = ["Incomplete Campaign", "Payments & Withdrawals", "Whoopro Account", "Posting", "Scheduling"];

export function HelpCenterTab() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {HELP_TOPICS.map((topic) => (
        <button
          key={topic}
          type="button"
          onClick={() => setNote(`The "${topic}" help article isn't available in this demo yet.`)}
          className="flex items-center justify-between rounded-xl border border-border-subtle bg-white px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-[#f8f9fb]"
        >
          {topic}
          <ChevronRight size={16} className="text-muted" />
        </button>
      ))}
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </div>
  );
}

const ABOUT_LINKS = ["Privacy & Policy", "Terms of Service"];

export function AboutTab() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {ABOUT_LINKS.map((link) => (
        <button
          key={link}
          type="button"
          onClick={() => setNote(`"${link}" isn't published in this demo yet.`)}
          className="flex items-center justify-between rounded-xl border border-border-subtle bg-white px-4 py-3 text-left text-sm font-medium text-ink transition hover:bg-[#f8f9fb]"
        >
          {link}
          <ChevronRight size={16} className="text-muted" />
        </button>
      ))}
      {note ? <p className="text-xs text-muted">{note}</p> : null}
    </div>
  );
}
