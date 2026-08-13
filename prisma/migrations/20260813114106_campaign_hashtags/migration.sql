-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[];
