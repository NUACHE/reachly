-- Replace free-text `kpis` (a checkbox list of vague, wordy engagement prompts, e.g.
-- "Engage 1 people in your audience group to respond by liking...") with two structured,
-- numeric targets a real synced post can actually be measured against. Only test/demo
-- campaigns exist today (verified via a direct query before writing this migration), so
-- dropping `kpis` loses no meaningful data.
ALTER TABLE "Campaign" DROP COLUMN "kpis",
ADD COLUMN "targetViews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "targetLikes" INTEGER NOT NULL DEFAULT 0;
