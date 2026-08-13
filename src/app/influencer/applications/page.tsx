import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { getInfluencerApplications } from "@/lib/data/influencer";

export default async function MyApplicationsPage() {
  const applications = await getInfluencerApplications("demo-influencer-1");

  return (
    <div>
      <Topbar title="My Applications" description="Track the status of every campaign you've applied to." />
      <div className="p-8">
        {applications.length === 0 ? (
          <p className="rounded-2xl border border-border-subtle bg-white px-6 py-10 text-center text-xs text-muted">
            You haven&apos;t applied to any campaigns yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8f9fb] tracking-wide text-muted uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Campaign</th>
                  <th className="px-6 py-3 font-medium">Match Score</th>
                  <th className="px-6 py-3 font-medium">Applied</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {applications.map((application) => (
                  <tr key={application.id} className="transition hover:bg-[#f8f9fb]">
                    <td className="px-6 py-4">
                      {application.campaign ? (
                        <Link
                          href={`/influencer/campaigns/${application.campaign.id}`}
                          className="font-medium text-ink hover:text-brand-blue"
                        >
                          {application.campaign.title}
                        </Link>
                      ) : (
                        <span className="text-muted">Campaign removed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted">{application.matchScore}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-muted">{application.appliedAt}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
