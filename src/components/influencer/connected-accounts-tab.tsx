"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { disconnectSocialAccountAction, syncSocialAccountAction } from "@/lib/actions/social";
import { PLATFORMS } from "@/lib/platforms";
import type { SocialPost } from "@/generated/prisma/client";

const YOUTUBE_META = PLATFORMS.find((p) => p.key === "YouTube")!;

export interface YoutubeAccountView {
  id: string;
  username: string | null;
  displayName: string | null;
  followerCount: number;
  lastSyncedAt: Date | null;
  posts: SocialPost[];
}

interface ConnectedAccountsTabProps {
  youtubeAccount: YoutubeAccountView | null;
  socialError?: string | null;
}

export function ConnectedAccountsTab({ youtubeAccount, socialError }: ConnectedAccountsTabProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(
    socialError ? "Couldn't connect your YouTube account. Please try again." : null
  );

  async function handleSync() {
    if (!youtubeAccount) return;
    setIsSyncing(true);
    setError(null);
    const result = await syncSocialAccountAction(youtubeAccount.id);
    setIsSyncing(false);
    if (!result.success) {
      setError(result.error ?? "Sync failed.");
      return;
    }
    router.refresh();
  }

  async function handleDisconnect() {
    if (!youtubeAccount) return;
    setIsDisconnecting(true);
    const result = await disconnectSocialAccountAction(youtubeAccount.id);
    setIsDisconnecting(false);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <p className="text-xs text-red-600">{error}</p> : null}

      <div className="rounded-xl border border-border-subtle bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`flex size-9 items-center justify-center rounded-full text-xs font-bold text-white ${YOUTUBE_META.color}`}>
              {YOUTUBE_META.short}
            </span>
            <div>
              <p className="text-sm font-medium text-ink">{youtubeAccount?.displayName ?? "YouTube"}</p>
              <p className="text-[11px] text-muted">
                {youtubeAccount
                  ? `${youtubeAccount.followerCount.toLocaleString()} subscribers${
                      youtubeAccount.lastSyncedAt ? ` · synced ${youtubeAccount.lastSyncedAt.toLocaleString()}` : ""
                    }`
                  : "Not connected"}
              </p>
            </div>
          </div>

          {youtubeAccount ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSync}
                disabled={isSyncing}
                aria-label="Sync now"
                className="flex size-8 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb] disabled:opacity-50"
              >
                <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
              </button>
              <Button variant="ghost" fullWidth={false} className="px-4 py-2 text-xs" disabled={isDisconnecting} onClick={handleDisconnect}>
                {isDisconnecting ? "Disconnecting…" : "Disconnect"}
              </Button>
            </div>
          ) : (
            <a href="/api/social/youtube/connect">
              <Button fullWidth={false} className="px-4 py-2 text-xs">
                Connect
              </Button>
            </a>
          )}
        </div>

        {youtubeAccount && youtubeAccount.posts.length > 0 ? (
          <div className="mt-4 flex flex-col gap-2 border-t border-border-subtle pt-3">
            <p className="text-[11px] font-medium text-muted">Recent Videos</p>
            {youtubeAccount.posts.map((post) => (
              <div key={post.id} className="flex items-center justify-between text-xs">
                <span className="truncate text-ink">{post.title}</span>
                <span className="shrink-0 text-muted">
                  {post.views.toLocaleString()} views · {post.likes.toLocaleString()} likes
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
