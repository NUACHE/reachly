import { Topbar } from "@/components/dashboard/topbar";
import { TeamTabs } from "@/components/team/team-tabs";
import { getBrandProfile, getTeamMembers } from "@/lib/data/brand";

export default async function BrandTeamPage() {
  const [brand, members] = await Promise.all([getBrandProfile(), getTeamMembers()]);

  return (
    <div>
      <Topbar title="Team" description="Manage your brand profile and teammates on this account." />
      <div className="p-8">
        <TeamTabs brand={{ companyName: brand.companyName, website: brand.website }} members={members} />
      </div>
    </div>
  );
}
