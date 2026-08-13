import { Topbar } from "@/components/dashboard/topbar";
import { StatusBadge } from "@/components/ui/status-badge";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { getAllUsers } from "@/lib/data/admin";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div>
      <Topbar title="Users" description="All registered accounts on the platform." />
      <div className="p-8">
        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f8f9fb] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#f8f9fb]">
                  <td className="px-6 py-4 font-medium text-ink">{user.name}</td>
                  <td className="px-6 py-4 text-muted">{user.email}</td>
                  <td className="px-6 py-4 text-muted">{user.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={user.suspended ? "REJECTED" : "ACTIVE"} />
                  </td>
                  <td className="px-6 py-4">
                    <UserRowActions userId={user.id} suspended={user.suspended} isAdmin={user.role === "ADMIN"} />
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
