"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreVertical, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { EditTeamMemberModal } from "@/components/team/edit-team-member-modal";
import { InviteTeamMemberModal } from "@/components/team/invite-team-member-modal";
import { roleLabel } from "@/components/team/team-role";
import { inviteTeamMemberAction, removeTeamMembersAction, updateTeamMemberAction } from "@/lib/actions/brand";
import type { TeamMember, TeamMemberRole } from "@/generated/prisma/client";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function TeamMembersTable({ initialMembers }: { initialMembers: TeamMember[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"All" | "Invite">("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = initialMembers.filter((member) => (filter === "Invite" ? member.invited : true));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allVisibleSelected = visible.length > 0 && visible.every((m) => selectedIds.includes(m.id));

  function toggleSelectAll() {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visible.some((m) => m.id === id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...visible.map((m) => m.id)])]);
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const result = await removeTeamMembersAction({ teamMemberIds: deleteTarget.ids });
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setSelectedIds((prev) => prev.filter((id) => !deleteTarget.ids.includes(id)));
    setDeleteTarget(null);
    router.refresh();
  }

  async function handleInvite(values: { email: string; role: TeamMemberRole }) {
    const result = await inviteTeamMemberAction(values);
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setInviteOpen(false);
    router.refresh();
  }

  async function handleSaveRole(role: TeamMemberRole) {
    if (!editing) return;
    const result = await updateTeamMemberAction({ teamMemberId: editing.id, role });
    if (!result.success) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setEditing(null);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-ink">Manage Team</h2>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 ? (
            <Button
              variant="primary"
              fullWidth={false}
              className="px-4 py-2 text-xs"
              onClick={() => setDeleteTarget({ ids: selectedIds, label: `${selectedIds.length} user(s)` })}
            >
              Delete Selected ({selectedIds.length})
            </Button>
          ) : null}
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as "All" | "Invite");
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-white px-3 py-2 text-xs font-medium text-ink outline-none"
          >
            <option value="All">All</option>
            <option value="Invite">Invite</option>
          </select>
          <Button fullWidth={false} className="flex items-center gap-2 px-4 py-2 text-xs" onClick={() => setInviteOpen(true)}>
            <UserPlus size={14} />
            Invite
          </Button>
        </div>
      </div>

      {error ? <p className="mb-3 text-xs text-red-600">{error}</p> : null}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border-subtle bg-white px-6 py-20 text-center">
          <p className="text-sm font-semibold text-ink">No team members available</p>
          <p className="text-xs text-muted">Please invite new team members</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
          <table className="w-full text-left text-sm">
            <thead className="text-xs font-medium text-muted">
              <tr className="border-b border-border-subtle">
                <th className="w-10 px-6 py-4">
                  <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} className="size-4 rounded border-border-subtle text-brand-blue focus:ring-brand-blue" />
                </th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Email</th>
                <th className="w-10 px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {visible.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(member.id)}
                      onChange={() => toggleSelect(member.id)}
                      className="size-4 rounded border-border-subtle text-brand-blue focus:ring-brand-blue"
                    />
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-ink">
                    {member.name}
                    {member.invited ? <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">Pending</span> : null}
                  </td>
                  <td className="px-6 py-4 text-xs text-ink">{roleLabel(member.role)}</td>
                  <td className="px-6 py-4 text-xs text-muted">{member.email}</td>
                  <td className="relative px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                      className="flex size-7 items-center justify-center rounded-lg text-muted hover:bg-[#f8f9fb]"
                      aria-label="Row actions"
                    >
                      <MoreVertical size={15} />
                    </button>
                    {openMenuId === member.id ? (
                      <div className="absolute right-6 top-12 z-10 w-32 rounded-lg border border-border-subtle bg-white py-1 shadow-md">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(member);
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center px-3 py-2 text-left text-xs text-ink hover:bg-[#f8f9fb]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTarget({ ids: [member.id], label: "1 user(s)" });
                            setOpenMenuId(null);
                          }}
                          className="flex w-full items-center px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-subtle px-6 py-3">
            <span className="text-xs text-muted">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-muted">
                Show
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-border-subtle bg-white px-2 py-1 text-xs text-ink outline-none"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                Entries
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex size-7 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb] disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`flex size-7 items-center justify-center rounded-lg text-xs font-medium transition ${
                      p === currentPage ? "bg-brand-blue text-white" : "text-ink hover:bg-[#f8f9fb]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex size-7 items-center justify-center rounded-lg text-muted transition hover:bg-[#f8f9fb] disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <EditTeamMemberModal open={!!editing} member={editing} onClose={() => setEditing(null)} onSave={handleSaveRole} />

      <InviteTeamMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={handleInvite} />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        heading={`Are you sure you want to delete ${deleteTarget?.label}?`}
        description="Deleting a user's account will remove all access the user has to your brand and campaigns."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
