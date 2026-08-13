-- Only YouTube (Google OAuth) social integration is supported; every other value on
-- SocialPlatform was never reachable from a working connect flow. Safe: as of this
-- migration, every SocialAccount row already has platform = 'YOUTUBE'.
BEGIN;

CREATE TYPE "SocialPlatform_new" AS ENUM ('YOUTUBE');
ALTER TABLE "SocialAccount" ALTER COLUMN "platform" TYPE "SocialPlatform_new" USING ("platform"::text::"SocialPlatform_new");
ALTER TYPE "SocialPlatform" RENAME TO "SocialPlatform_old";
ALTER TYPE "SocialPlatform_new" RENAME TO "SocialPlatform";
DROP TYPE "SocialPlatform_old";

COMMIT;
