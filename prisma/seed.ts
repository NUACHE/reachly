import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

/**
 * Creates real DB rows for the 3 fixed demo accounts (src/lib/demo-accounts.ts) so that
 * logging in as them doesn't crash — getCurrentBrandProfile/getCurrentInfluencerProfile
 * always query Prisma for a profile matching the session's user id, and until this seed
 * runs, "demo-brand-1"/"demo-influencer-1" have no such row (Technical_Debt_Plan DEBT-01b).
 * Safe to re-run: upserts by email, and does not touch any account it didn't create.
 */
async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.user.upsert({
    where: { email: "brand.demo@reachly.app" },
    update: {},
    create: {
      id: "demo-brand-1",
      email: "brand.demo@reachly.app",
      passwordHash,
      role: "BRAND",
      brandProfile: {
        create: {
          companyName: "Northwind Coffee Co.",
          website: "https://northwindcoffee.example.com",
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "influencer.demo@reachly.app" },
    update: {},
    create: {
      id: "demo-influencer-1",
      email: "influencer.demo@reachly.app",
      passwordHash,
      role: "INFLUENCER",
      influencerProfile: {
        create: {
          displayName: "Ama Boateng",
          bio: "Lifestyle and beauty content creator.",
          niches: ["Beauty", "Lifestyle"],
          followerCount: 45000,
          engagementRate: 4.8,
          portfolioLinks: [],
        },
      },
    },
  });

  await prisma.user.upsert({
    where: { email: "admin.demo@reachly.app" },
    update: {},
    create: {
      id: "demo-admin-1",
      email: "admin.demo@reachly.app",
      passwordHash,
      role: "ADMIN",
      name: "Reachly Admin",
    },
  });

  console.log("Seed complete: brand.demo, influencer.demo, admin.demo accounts ensured.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
