"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, LineChart, Pencil, Settings, Users, Users2, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PlatformMetricsChart } from "@/components/dashboard/platform-metrics-chart";
import { InfluencerPerformanceTable, type InfluencerPerformanceRow } from "@/components/dashboard/influencer-performance-table";
import { ApplicationRow } from "@/components/campaigns/application-row";
import { EditCampaignModal } from "@/components/campaigns/edit-campaign-modal";
import { Button } from "@/components/ui/button";
import { initialsFor } from "@/lib/initials";
import { formatCompact } from "@/lib/format";
import type { MockActivityItem, MockApplication, MockCampaign, MockCampaignMetrics } from "@/lib/mock-data";
import type { PlatformMetricPoint } from "@/lib/data/platform-metrics";

const TABS = ["Overview", "Guidelines", "Influencers", "Settings"] as const;
type Tab = (typeof TABS)[number];

interface CampaignDetailTabsProps {
  campaign: MockCampaign;
  metrics: MockCampaignMetrics;
  activity: MockActivityItem[];
  influencerRows: InfluencerPerformanceRow[];
  applications: MockApplication[];
  platformMetrics: PlatformMetricPoint[];
}

export function CampaignDetailTabs({ campaign, metrics, activity, influencerRows, applications, platformMetrics }: CampaignDetailTabsProps) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [editOpen, setEditOpen] = useState(false);

  const accepted = applications.filter((a) => a.status === "ACCEPTED" || a.status === "COMPLETED");
  const pending = applications.filter((a) => a.status === "PENDING");

  return (
    <div>
      <div className="mb-6 flex gap-6 border-b border-border-subtle">
        {TABS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setTab(option)}
            className={`-mb-px border-b-2 px-1 py-3 text-xs font-medium transition ${
              tab === option ? "border-brand-orange text-brand-orange" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {tab === "Overview" ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Engagements" value={metrics.engagements.toLocaleString()} icon={Heart} />
            <StatCard label="Reach" value={metrics.reach.toLocaleString()} icon={Users} accent="orange" />
            <StatCard label="Impressions" value={formatCompact(metrics.impressions)} icon={LineChart} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PlatformMetricsChart points={platformMetrics} />
            </div>
            <div className="rounded-2xl border border-border-subtle bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-ink">Recent Campaign Activity</h2>
              {activity.length === 0 ? (
                <p className="text-xs text-muted">No activity yet.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {activity.map((item) => (
                    <li key={item.id} className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f0f1f5] text-[10px] font-semibold text-ink">
                        {initialsFor(item.influencerName)}
                      </span>
                      <div className="text-xs">
                        <p className="text-ink">
                          <span className="font-medium">{item.influencerName}</span> {item.action}
                        </p>
                        <p className="text-muted">{item.timeAgo}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard label="Total Influencers" value={metrics.totalInfluencers} icon={Users2} />
            <StatCard label="Total Published Posts" value={metrics.totalPublishedPosts} icon={Pencil} accent="orange" />
            <StatCard label="Total Spend" value={`¢${metrics.totalSpend.toFixed(2)}`} icon={Wallet} />
          </div>

          <InfluencerPerformanceTable rows={influencerRows} />
        </div>
      ) : null}

      {tab === "Guidelines" ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border-subtle bg-white p-6 sm:grid-cols-4">
            <Detail label="Objective" value={campaign.objective} />
            <Detail label="Niches" value={campaign.niches.join(", ")} />
            <Detail label="Budget" value={`¢${campaign.budget}`} />
            <Detail label="Audience Size" value={`${campaign.minFollowers.toLocaleString()}–${campaign.maxFollowers.toLocaleString()}`} />
            <Detail label="Deliverables" value={campaign.deliverables} />
            <Detail label="Deadline" value={campaign.deadline} />
          </div>

          {campaign.kpis?.length ? (
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-ink">Key Performance Indicators (KPIs)</h3>
              <ul className="flex flex-col gap-2">
                {campaign.kpis.map((kpi, i) => (
                  <li key={i} className="text-xs text-muted">
                    • {kpi}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {campaign.hashtags?.length ? (
            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              <h3 className="mb-1 text-sm font-semibold text-ink">Hashtags</h3>
              <p className="mb-3 text-xs text-muted">
                A synced post is matched to this campaign when its title or description includes one of these.
              </p>
              <div className="flex flex-wrap gap-2">
                {campaign.hashtags.map((tag, i) => (
                  <span key={i} className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-brand-blue">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {campaign.postingSchedule?.length ? (
              <div className="rounded-2xl border border-border-subtle bg-white p-6">
                <h3 className="mb-3 text-sm font-semibold text-ink">Posting Schedule</h3>
                <ul className="flex flex-col gap-2">
                  {campaign.postingSchedule.map((item, i) => (
                    <li key={i} className="text-xs text-muted">
                      {item.platform} · {item.count} Posts {item.frequency}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-2xl border border-border-subtle bg-white p-6">
              {campaign.dos?.length ? (
                <>
                  <h3 className="mb-3 text-sm font-semibold text-ink">Do&apos;s</h3>
                  <ul className="mb-4 flex flex-col gap-2">
                    {campaign.dos.map((item, i) => (
                      <li key={i} className="text-xs text-muted">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              {campaign.donts?.length ? (
                <>
                  <h3 className="mb-3 text-sm font-semibold text-ink">Don&apos;ts</h3>
                  <ul className="flex flex-col gap-2">
                    {campaign.donts.map((item, i) => (
                      <li key={i} className="text-xs text-muted">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {tab === "Influencers" ? (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">
              Active Influencers <span className="text-muted">({accepted.length})</span>
            </h3>
            {accepted.length === 0 ? (
              <div className="rounded-2xl border border-border-subtle bg-white px-6 py-10 text-center">
                <p className="text-sm font-medium text-ink">No Active Influencers</p>
                <Link href="/brand/influencers" className="mt-1 inline-block text-xs text-brand-blue hover:underline">
                  Check out our Influencers
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-white">
                {accepted.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-ink">
              Requests <span className="text-muted">({pending.length})</span>
            </h3>
            {pending.length === 0 ? (
              <p className="rounded-2xl border border-border-subtle bg-white px-6 py-10 text-center text-xs text-muted">No pending requests.</p>
            ) : (
              <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-white">
                {pending.map((application) => (
                  <ApplicationRow key={application.id} application={application} />
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}

      {tab === "Settings" ? (
        <div className="rounded-2xl border border-border-subtle bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-muted" />
              <h3 className="text-sm font-semibold text-ink">Campaign Settings</h3>
            </div>
            <Button fullWidth={false} className="px-6" onClick={() => setEditOpen(true)}>
              Edit Campaign
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted">Update the campaign title and description.</p>
        </div>
      ) : null}

      <EditCampaignModal
        open={editOpen}
        campaignId={campaign.id}
        initialTitle={campaign.title}
        initialDescription={campaign.description}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
