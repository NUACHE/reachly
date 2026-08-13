import { Topbar } from "@/components/dashboard/topbar";
import { AccountSettingsTabs } from "@/components/account/account-settings-tabs";
import { requireUser } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

export default async function BrandAccountPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });

  return (
    <div>
      <Topbar title="Account Settings" />
      <div className="p-8">
        <AccountSettingsTabs name={user?.name ?? ""} email={user?.email ?? ""} />
      </div>
    </div>
  );
}
