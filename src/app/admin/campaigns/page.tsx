import { Topbar } from "@/components/dashboard/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { CampaignRowActions } from "@/components/admin/campaign-row-actions";
import { getAllCampaignsAdmin } from "@/lib/data/admin";

export default async function AdminCampaignsPage() {
  const campaigns = await getAllCampaignsAdmin();

  return (
    <div>
      <Topbar title="Campaigns" description="All campaigns across every brand on the platform." />
      <div className="p-8">
        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fb] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Campaign</th>
                <th className="px-6 py-3 font-medium">Niches</th>
                <th className="px-6 py-3 font-medium">Budget</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="transition hover:bg-[#f8f9fb]">
                  <td className="px-6 py-4 font-medium text-ink">{campaign.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted">{campaign.niches.join(", ")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted">¢{campaign.budget}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4">
                    <CampaignRowActions campaignId={campaign.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
