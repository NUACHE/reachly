import { Bell, Mail } from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { getInfluencerAlerts } from "@/lib/data/influencer";

export default async function InfluencerAlertsPage() {
  const alerts = await getInfluencerAlerts("demo-influencer-1");

  return (
    <div>
      <Topbar title="Alerts" />
      <div className="p-8">
        {alerts.length === 0 ? (
          <p className="rounded-2xl border border-border-subtle bg-white px-6 py-16 text-center text-sm text-muted">No alerts yet.</p>
        ) : (
          <ul className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-white">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex items-start gap-4 px-6 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  {alert.icon === "mail" ? <Mail size={16} /> : <Bell size={16} />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-blue">{alert.title}</p>
                    {alert.badge ? (
                      <span className="rounded-full bg-brand-blue/10 px-2 py-0.5 text-[10px] font-medium text-brand-blue">{alert.badge}</span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{alert.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
