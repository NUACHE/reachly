"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Megaphone, MessageCircle, Rocket, Search, ThumbsUp, UploadCloud, UserPlus, X } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { TextField } from "@/components/ui/text-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { NicheSelector } from "@/components/ui/niche-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TagListEditor } from "@/components/campaigns/tag-list-editor";
import { InfluencerInviteCard } from "@/components/campaigns/influencer-invite-card";
import { createCampaignAction } from "@/lib/actions/campaigns";
import { PLATFORMS } from "@/lib/platforms";
import type { SocialAccount } from "@/generated/prisma/client";
import type { CampaignObjective, MockInfluencer } from "@/lib/mock-data";

type DirectoryInfluencer = MockInfluencer & { socialAccounts: Pick<SocialAccount, "id" | "platform" | "followerCount">[] };

type Phase = "objective" | "details" | "rules" | "rules-confirm" | "schedule" | "start-confirm";

const OBJECTIVES: { key: CampaignObjective; title: string; description: string; icon: typeof Megaphone }[] = [
  { key: "AWARENESS", title: "Awareness", description: "I want my brand to reach a lot of people", icon: Megaphone },
  { key: "ENGAGEMENT", title: "Engagement", description: "I want people to like, comment & share", icon: MessageCircle },
  { key: "PRODUCT", title: "Product", description: "I want to sell a product or service", icon: Rocket },
];

function stepForPhase(phase: Phase) {
  switch (phase) {
    case "objective":
      return 1;
    case "details":
      return 2;
    case "rules":
    case "rules-confirm":
      return 3;
    case "schedule":
      return 4;
    default:
      return 5;
  }
}

function phaseForStep(step: number): Phase {
  switch (step) {
    case 1:
      return "objective";
    case 2:
      return "details";
    case 3:
      return "rules";
    case 4:
      return "schedule";
    default:
      return "start-confirm";
  }
}

interface CampaignWizardProps {
  influencers: DirectoryInfluencer[];
}

export function CampaignWizard({ influencers }: CampaignWizardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<Phase>("objective");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [objective, setObjective] = useState<CampaignObjective | null>(null);

  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [niches, setNiches] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState("1000");
  const [maxFollowers, setMaxFollowers] = useState("50000");
  const [deliverables, setDeliverables] = useState("");
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [allowRequests, setAllowRequests] = useState(true);
  const [visibleToAll, setVisibleToAll] = useState(false);

  const [targetViews, setTargetViews] = useState("");
  const [targetLikes, setTargetLikes] = useState("");
  const [dos, setDos] = useState<string[]>(["All posts must go with all the 4 hashtags", "Each post should have minimum of 2 and maximum of 4 pics in post"]);
  const [donts, setDonts] = useState<string[]>(["No offensive captions", "All posts must go with no hashtags"]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>(["#cleanaccra", "#letsmakeaccrawork"]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [schedule, setSchedule] = useState(
    PLATFORMS.reduce<Record<string, { enabled: boolean; count: number; frequency: "Per Day" | "Per Week" }>>(
      (acc, platform) => {
        acc[platform.key] = { enabled: false, count: 1, frequency: "Per Day" };
        return acc;
      },
      {}
    )
  );
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [influencerSearch, setInfluencerSearch] = useState("");

  function handleMediaChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setMediaPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  }

  function toggleInvite(id: string) {
    setInvitedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }

  async function handleStartCampaign() {
    setIsSubmitting(true);
    setError(null);

    const result = await createCampaignAction({
      title,
      description,
      objective,
      niches,
      minFollowers: Number(minFollowers),
      maxFollowers: Number(maxFollowers),
      budget: Number(budget),
      deliverables,
      deadline: endDate,
      targetViews: targetViews ? Number(targetViews) : undefined,
      targetLikes: targetLikes ? Number(targetLikes) : undefined,
      dos,
      donts,
      hashtags,
      postingSchedule: Object.entries(schedule)
        .filter(([, value]) => value.enabled)
        .map(([platform, value]) => ({ platform, count: value.count, frequency: value.frequency })),
      invitedInfluencerIds: invitedIds,
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error ?? "Something went wrong. Please try again.");
      return;
    }

    router.push(`/brand/campaigns/${result.campaignId}`);
    router.refresh();
  }

  return (
    <div>
      <Topbar title="Create Campaign" description="Please provide information to help create your campaign" />
      <div className="p-8">
        <div className="rounded-2xl border border-border-subtle bg-white p-8">
          <Stepper current={stepForPhase(phase)} onStepClick={(step) => setPhase(phaseForStep(step))} />

          {phase === "objective" ? (
            <div className="flex flex-col items-center gap-8">
              <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
                {OBJECTIVES.map((option) => {
                  const selected = objective === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setObjective(option.key)}
                      className={`flex flex-col items-center gap-3 rounded-2xl border p-6 text-center transition ${
                        selected ? "border-brand-orange" : "border-border-subtle hover:border-brand-blue/40"
                      }`}
                    >
                      <span className={`flex size-14 items-center justify-center rounded-xl ${selected ? "bg-brand-orange/10 text-brand-orange" : "bg-[#f8f9fb] text-muted"}`}>
                        <option.icon size={26} />
                      </span>
                      <p className={`text-sm font-semibold ${selected ? "text-brand-orange" : "text-ink"}`}>{option.title}</p>
                      <p className="text-xs text-muted">{option.description}</p>
                      <span className={`h-1 w-10 rounded-full ${selected ? "bg-brand-orange" : "bg-border-subtle"}`} />
                    </button>
                  );
                })}
              </div>
              <Button fullWidth={false} className="px-10" disabled={!objective} onClick={() => setPhase("details")}>
                Next
              </Button>
            </div>
          ) : null}

          {phase === "details" ? (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  label="What is your campaign called?"
                  name="title"
                  placeholder="Lorem ipsum"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={title.length > 0 && title.trim().length < 3 ? `At least 3 characters required (${title.trim().length}/3)` : undefined}
                />
                <TextField label="Budget" name="budget" type="number" min={0} placeholder="¢150" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>

              <TextareaField
                label="How will you describe your campaign?"
                name="description"
                rows={3}
                placeholder="Lorem ipsum dummy text."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={
                  description.length > 0 && description.trim().length < 10
                    ? `At least 10 characters required (${description.trim().length}/10)`
                    : undefined
                }
              />

              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Target Niches (pick up to 3)</span>
                <NicheSelector value={niches} onChange={setNiches} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField label="Min Followers" name="minFollowers" type="number" min={0} value={minFollowers} onChange={(e) => setMinFollowers(e.target.value)} />
                <TextField label="Max Followers" name="maxFollowers" type="number" min={0} value={maxFollowers} onChange={(e) => setMaxFollowers(e.target.value)} />
              </div>

              <TextareaField
                label="Deliverables"
                name="deliverables"
                rows={2}
                placeholder="e.g. 1 YouTube video + 2 Shorts"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                error={
                  deliverables.length > 0 && deliverables.trim().length < 5
                    ? `At least 5 characters required (${deliverables.trim().length}/5)`
                    : undefined
                }
              />

              <div className="flex flex-wrap gap-4">
                {mediaPreviews.map((src, i) => (
                  <div key={src} className="relative size-24 overflow-hidden rounded-xl border border-border-subtle">
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                    <button
                      type="button"
                      onClick={() => setMediaPreviews((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-white"
                      aria-label="Remove image"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex size-24 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border-subtle bg-[#f8f9fb] text-center transition hover:border-brand-blue"
                >
                  <UploadCloud size={18} className="text-brand-blue" />
                  <span className="text-[10px] text-muted">
                    Drag And Drop Or <span className="text-brand-blue">Browse</span>
                  </span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleMediaChange} />
              </div>

              <div className="flex flex-col gap-2">
                <Checkbox label="Allow influencers to request to join a campaign" checked={allowRequests} onChange={(e) => setAllowRequests(e.target.checked)} />
                <Checkbox label="Make your campaign visible to all influencers" checked={visibleToAll} onChange={(e) => setVisibleToAll(e.target.checked)} />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" fullWidth={false} className="px-8" onClick={() => setPhase("objective")}>
                  Back
                </Button>
                <Button
                  fullWidth={false}
                  className="px-8"
                  disabled={
                    title.trim().length < 3 ||
                    description.trim().length < 10 ||
                    niches.length === 0 ||
                    deliverables.trim().length < 5 ||
                    !budget ||
                    Number(budget) <= 0
                  }
                  onClick={() => setPhase("rules")}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}

          {phase === "rules" ? (
            <div className="flex flex-col gap-5">
              <div className="rounded-2xl border border-border-subtle bg-white p-5">
                <h3 className="mb-1 text-sm font-semibold text-ink">Key Performance Indicators (KPIs)</h3>
                <p className="mb-4 text-xs text-muted">
                  Set numeric targets. Once an influencer connects YouTube and posts, their real
                  view/like counts are measured against these to show campaign progress. Leave a
                  target at 0 to skip tracking that metric.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField
                    label="Target Views"
                    name="targetViews"
                    type="number"
                    min={0}
                    placeholder="e.g. 10000"
                    value={targetViews}
                    onChange={(e) => setTargetViews(e.target.value)}
                  />
                  <TextField
                    label="Target Likes"
                    name="targetLikes"
                    type="number"
                    min={0}
                    placeholder="e.g. 500"
                    value={targetLikes}
                    onChange={(e) => setTargetLikes(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TagListEditor label="Campaign Do's" values={dos} onChange={setDos} theme="green" />
                <TagListEditor label="Campaign Don'ts" values={donts} onChange={setDonts} theme="red" />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TagListEditor label="Hashtags" placeholder="Add hashtag" values={hashtags} onChange={setHashtags} theme="blue" />
                <TagListEditor label="Topics" placeholder="Add topics" values={topics} onChange={setTopics} theme="blue" />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" fullWidth={false} className="px-8" onClick={() => setPhase("details")}>
                  Back
                </Button>
                <Button fullWidth={false} className="px-8" onClick={() => setPhase("rules-confirm")}>
                  Preview
                </Button>
              </div>
            </div>
          ) : null}

          {phase === "rules-confirm" ? (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-sm font-semibold text-ink">Preview</h2>
                <p className="mt-1 text-xs text-muted">Review your campaign before submitting it for approval.</p>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-white p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-ink">{title || "Untitled campaign"}</h3>
                    <p className="mt-1 text-xs text-muted">{description || "No description yet."}</p>
                  </div>
                  {objective ? (
                    <span className="shrink-0 rounded-full bg-brand-orange/10 px-2.5 py-1 text-[10px] font-semibold text-brand-orange">{objective}</span>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <PreviewDetail label="Niches" value={niches.length ? niches.join(", ") : "—"} />
                  <PreviewDetail label="Budget" value={budget ? `¢${Number(budget).toLocaleString()}` : "—"} />
                  <PreviewDetail label="Audience Size" value={`${Number(minFollowers).toLocaleString()}–${Number(maxFollowers).toLocaleString()}`} />
                  <PreviewDetail label="Media" value={`${mediaPreviews.length} file(s)`} />
                </div>

                <div className="mt-4">
                  <p className="text-xs font-medium text-ink">Deliverables</p>
                  <p className="mt-1 text-xs text-muted">{deliverables || "—"}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold text-ink">Key Performance Indicators (KPIs)</h3>
                {!targetViews && !targetLikes ? (
                  <p className="text-xs text-muted">No targets set.</p>
                ) : (
                  <ul className="flex flex-col gap-2">
                    {targetViews ? <li className="text-xs text-muted">• {Number(targetViews).toLocaleString()} views</li> : null}
                    {targetLikes ? <li className="text-xs text-muted">• {Number(targetLikes).toLocaleString()} likes</li> : null}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PreviewTagList label="Do's" values={dos} />
                <PreviewTagList label="Don'ts" values={donts} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PreviewTagList label="Hashtags" values={hashtags} />
                <PreviewTagList label="Topics" values={topics} />
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="secondary" fullWidth={false} className="px-8" onClick={() => setPhase("rules")}>
                  Back
                </Button>
                <Button fullWidth={false} className="px-8" onClick={() => setPhase("schedule")}>
                  Submit For Approval
                </Button>
              </div>
            </div>
          ) : null}

          {phase === "schedule" ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Start Date" name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <TextField label="End Date" name="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <div>
                <h3 className="mb-1 text-sm font-semibold text-ink">Posting Schedule</h3>
                <p className="mb-3 text-xs text-muted">
                  Posts are counted automatically once the influencer connects their YouTube account.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {PLATFORMS.map((platform) => {
                    const row = schedule[platform.key];
                    return (
                      <div key={platform.key} className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2">
                        <input
                          type="checkbox"
                          checked={row.enabled}
                          onChange={() =>
                            setSchedule((prev) => ({ ...prev, [platform.key]: { ...prev[platform.key], enabled: !prev[platform.key].enabled } }))
                          }
                          className="size-4 shrink-0 rounded border-border-subtle text-brand-blue focus:ring-brand-blue"
                        />
                        <span className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${platform.color}`}>
                          {platform.short}
                        </span>
                        <span className="min-w-14 text-xs text-ink">{platform.key}</span>
                        <input
                          type="number"
                          min={0}
                          value={row.count}
                          onChange={(e) =>
                            setSchedule((prev) => ({ ...prev, [platform.key]: { ...prev[platform.key], count: Number(e.target.value) } }))
                          }
                          className="w-14 rounded border border-border-subtle px-2 py-1 text-center text-xs"
                        />
                        <span className="text-xs text-muted">Posts</span>
                        <select
                          value={row.frequency}
                          onChange={(e) =>
                            setSchedule((prev) => ({
                              ...prev,
                              [platform.key]: { ...prev[platform.key], frequency: e.target.value as "Per Day" | "Per Week" },
                            }))
                          }
                          className="ml-auto rounded border border-border-subtle bg-white px-2 py-1 text-xs text-ink"
                        >
                          <option>Per Day</option>
                          <option>Per Week</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-2xl bg-brand-orange/10 px-8 py-4 text-center">
                  <p className="text-xs text-muted">Campaign Budget</p>
                  <p className="text-lg font-semibold text-brand-orange">¢{Number(budget).toLocaleString()}</p>
                </div>
              </div>

              <InfluencerSelectionPanel
                influencers={influencers}
                search={influencerSearch}
                onSearchChange={setInfluencerSearch}
                invitedIds={invitedIds}
                onToggleInvite={toggleInvite}
              />

              <div className="flex justify-end gap-3">
                <Button variant="ghost" fullWidth={false} className="px-8" disabled title="Draft saving isn't available yet">
                  Save
                </Button>
                <Button fullWidth={false} className="px-8" onClick={() => setPhase("start-confirm")}>
                  Continue
                </Button>
              </div>
            </div>
          ) : null}

          {phase === "start-confirm" ? (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                <ThumbsUp size={28} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">All set! Let&apos;s Start The Campaign</h2>
                <p className="mt-1 text-xs text-muted">Start your campaign to go live.</p>
              </div>
              <div className="rounded-2xl bg-[#f8f9fb] px-10 py-5">
                <p className="text-xs text-muted">Campaign Costs</p>
                <p className="text-xl font-semibold text-brand-orange">¢{Number(budget).toLocaleString()}</p>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button disabled={isSubmitting} fullWidth={false} className="px-10" onClick={handleStartCampaign}>
                {isSubmitting ? "Starting…" : "Start Campaign"}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Stepper({ current, onStepClick }: { current: number; onStepClick: (step: number) => void }) {
  return (
    <div className="mb-10 flex items-center justify-center">
      {[1, 2, 3, 4, 5].map((n, i) => (
        <div key={n} className="flex items-center">
          <button
            type="button"
            disabled={n > current}
            onClick={() => onStepClick(n)}
            className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold transition ${
              n <= current ? "bg-brand-blue text-white hover:brightness-95" : "cursor-not-allowed bg-[#eceef2] text-muted"
            }`}
          >
            {String(n).padStart(2, "0")}
          </button>
          {i < 4 ? <span className={`h-px w-16 ${n < current ? "bg-brand-blue" : "bg-[#eceef2]"}`} /> : null}
        </div>
      ))}
    </div>
  );
}

function PreviewDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-0.5 text-xs font-medium text-ink">{value}</p>
    </div>
  );
}

function PreviewTagList({ label, values }: { label: string; values: string[] }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink">{label}</h3>
      {values.length === 0 ? (
        <p className="text-xs text-muted">None added.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map((value, i) => (
            <span key={i} className="rounded-full border border-border-subtle px-3 py-1 text-xs text-ink">
              {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function InfluencerSelectionPanel({
  influencers,
  search,
  onSearchChange,
  invitedIds,
  onToggleInvite,
}: {
  influencers: DirectoryInfluencer[];
  search: string;
  onSearchChange: (value: string) => void;
  invitedIds: string[];
  onToggleInvite: (id: string) => void;
}) {
  const [tab, setTab] = useState<"active" | "requests">("active");
  const filtered = influencers.filter((influencer) => influencer.displayName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab("active")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === "active" ? "bg-brand-orange text-white" : "bg-[#f8f9fb] text-muted"}`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setTab("requests")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold ${tab === "requests" ? "bg-brand-orange text-white" : "bg-[#f8f9fb] text-muted"}`}
          >
            Requests
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Influencer"
              className="rounded-lg border border-border-subtle bg-white py-1.5 pl-8 pr-3 text-xs text-ink placeholder:text-muted/70 focus:border-brand-blue focus:outline-none"
            />
          </div>
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-brand-orange px-3 py-1.5 text-xs font-semibold text-white hover:brightness-95">
            <UserPlus size={13} />
            Invite New
          </button>
        </div>
      </div>

      {tab === "requests" ? (
        <p className="rounded-2xl border border-border-subtle bg-white px-6 py-10 text-center text-xs text-muted">No pending requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((influencer) => (
            <InfluencerInviteCard
              key={influencer.id}
              influencer={influencer}
              invited={invitedIds.includes(influencer.id)}
              onToggle={() => onToggleInvite(influencer.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
