import { DEMO_MODE, DEMO_ACCOUNTS } from "@/lib/demo-accounts";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";

/** TEMPORARY demo-mode data access (DEBT-01) — see src/lib/data/brand.ts. */

export async function getAllUsers() {
  if (DEMO_MODE) return DEMO_ACCOUNTS;
  throw new Error("Live database not yet connected — see Technical_Debt_Plan DEBT-01");
}

export async function getAllCampaignsAdmin() {
  if (DEMO_MODE) return MOCK_CAMPAIGNS;
  throw new Error("Live database not yet connected — see Technical_Debt_Plan DEBT-01");
}
