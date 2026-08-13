import type { Role } from "@/generated/prisma/client";

/**
 * TEMPORARY, pending Neon connection (see Technical_Debt_Plan: DEBT-01).
 * Lets the UI be built and reviewed end-to-end before the database exists.
 * Must be removed (or DEMO_MODE left unset) once real accounts can be created.
 */
export const DEMO_MODE = process.env.DEMO_MODE === "true";

export interface DemoAccount {
  id: string;
  email: string;
  password: string;
  role: Role;
  name: string;
  suspended: boolean;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "demo-brand-1",
    email: "brand.demo@reachly.app",
    password: "password123",
    role: "BRAND",
    name: "Northwind Coffee Co.",
    suspended: false,
  },
  {
    id: "demo-influencer-1",
    email: "influencer.demo@reachly.app",
    password: "password123",
    role: "INFLUENCER",
    name: "Ama Boateng",
    suspended: false,
  },
  {
    id: "demo-admin-1",
    email: "admin.demo@reachly.app",
    password: "password123",
    role: "ADMIN",
    name: "Reachly Admin",
    suspended: false,
  },
];

export function findDemoAccount(email: string, password: string): DemoAccount | undefined {
  return DEMO_ACCOUNTS.find(
    (account) => account.email === email && account.password === password && !account.suspended
  );
}
