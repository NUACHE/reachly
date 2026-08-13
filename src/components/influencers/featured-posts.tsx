import { platformMetaForEnum } from "@/lib/platforms";
import type { SocialAccount, SocialPost } from "@/generated/prisma/client";

type ConnectedAccount = Pick<SocialAccount, "id" | "platform"> & {
  posts: Pick<SocialPost, "id" | "title" | "url" | "views" | "likes" | "comments" | "postedAt">[];
};

export function FeaturedPosts({ socialAccounts }: { socialAccounts: ConnectedAccount[] }) {
  const posts = socialAccounts
    .flatMap((account) => account.posts.map((post) => ({ ...post, platform: account.platform })))
    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime())
    .slice(0, 4);

  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-ink">Recent Posts</h2>

      {posts.length === 0 ? (
        <p className="text-xs text-muted">No posts synced yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {posts.map((post) => {
            const meta = platformMetaForEnum(post.platform);
            return (
              <a
                key={post.id}
                href={post.url ?? undefined}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-border-subtle p-4 transition hover:border-brand-blue"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="truncate text-xs font-medium text-ink">{post.title}</span>
                  {meta ? (
                    <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${meta.color}`}>
                      {meta.short}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-muted">
                  {post.views.toLocaleString()} views · {post.likes.toLocaleString()} likes · {post.comments.toLocaleString()} comments
                </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
