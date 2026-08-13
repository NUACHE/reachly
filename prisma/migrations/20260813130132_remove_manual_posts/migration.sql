/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_applicationId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropEnum
DROP TYPE "PostStatus";
