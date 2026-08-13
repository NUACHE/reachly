import { platformMetaForEnum } from "@/lib/platforms";

export interface CampaignLinkedPost {
  id: string;
  platform: string;
  title: string | null;
  url: string | null;
  postedAt: Date;
  views: number;
  likes: number;
  comments: number;
}

export function CampaignPostsList({ posts }: { posts: CampaignLinkedPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">
        No posts counted yet. Post on a connected social account with one of this campaign&apos;s hashtags, then sync that account —
        matching posts are linked here automatically.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post) => {
        const meta = platformMetaForEnum(post.platform);
        return (
          <a
            key={post.id}
            href={post.url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col gap-3 rounded-2xl border border-border-subtle bg-white p-4 transition hover:border-brand-blue"
          >
            <div className="flex items-center justify-between text-xs text-muted">
              <span>{post.postedAt.toLocaleDateString()}</span>
              {meta ? (
                <span className={`flex size-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${meta.color}`}>
                  {meta.short}
                </span>
              ) : null}
            </div>
            <p className="text-xs font-medium text-ink">{post.title}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <StatBox label="Views" value={post.views} />
              <StatBox label="Likes" value={post.likes} />
              <StatBox label="Comments" value={post.comments} />
            </div>
          </a>
        );
      })}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-[#f8f9fb] py-2">
      <p className="text-sm font-semibold text-ink">{value.toLocaleString()}</p>
      <p className="text-[10px] text-muted">{label}</p>
    </div>
  );
}
