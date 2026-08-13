import { notFound } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { InfluencerProfileHeader } from "@/components/influencers/influencer-profile-header";
import { AudiencePanel } from "@/components/influencers/audience-panel";
import { FeaturedPosts } from "@/components/influencers/featured-posts";
import { getBrandCampaigns, getInfluencerProfile } from "@/lib/data/brand";

export default async function InfluencerDetailPage({ params }: PageProps<"/brand/influencers/[id]">) {
  const { id } = await params;
  const [influencer, campaigns] = await Promise.all([getInfluencerProfile(id), getBrandCampaigns()]);

  if (!influencer) notFound();

  return (
    <div>
      <Topbar title="Influencer Detail" />
      <div className="flex flex-col gap-4 p-8">
        <InfluencerProfileHeader influencer={influencer} campaigns={campaigns} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <AudiencePanel socialAccounts={influencer.socialAccounts} />
          <FeaturedPosts socialAccounts={influencer.socialAccounts} />
        </div>
      </div>
    </div>
  );
}
