import { Download, Megaphone, Users, Wallet } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverviewPanel } from "@/components/dashboard/overview-panel";
import { PlatformMetricsChart } from "@/components/dashboard/platform-metrics-chart";
import { InfluencerPerformanceTable } from "@/components/dashboard/influencer-performance-table";
import { Button } from "@/components/ui/button";
import {
  getBrandInfluencerPerformance,
  getBrandOverviewStats,
  getBrandPerformanceOverview,
  getBrandPlatformMetrics,
} from "@/lib/data/brand";

export default async function BrandDashboardPage() {
  const [overview, performance, influencerRows, platformMetrics] = await Promise.all([
    getBrandOverviewStats(),
    getBrandPerformanceOverview(),
    getBrandInfluencerPerformance(),
    getBrandPlatformMetrics(),
  ]);

  return (
    <div>
      <Topbar
        title="Dashboard"
        action={
          <Button fullWidth={false} className="flex items-center gap-2 px-6">
            <Download size={16} />
            Export
          </Button>
        }
      />

      <div className="grid gap-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Spend"
            value={`¢${overview.totalSpend.toLocaleString()}`}
            icon={Wallet}
            trend={overview.totalSpendTrend}
          />
          <StatCard
            label="Average Campaign Spend"
            value={`¢${overview.avgCampaignSpend.toLocaleString()}`}
            icon={Wallet}
            accent="orange"
            trend={overview.avgCampaignSpendTrend}
          />
          <StatCard
            label="Number of Campaigns"
            value={overview.campaignCount}
            icon={Megaphone}
            trend={overview.campaignCountTrend}
          />
          <StatCard
            label="Number of Influencers"
            value={overview.influencerCount}
            icon={Users}
            accent="orange"
            trend={overview.influencerCountTrend}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <OverviewPanel
            reach={performance.reach}
            engagement={performance.engagement}
            impressions={performance.impressions}
          />
          <div className="lg:col-span-2">
            <PlatformMetricsChart points={platformMetrics} />
          </div>
        </div>

        <InfluencerPerformanceTable rows={influencerRows} />
      </div>
    </div>
  );
}
