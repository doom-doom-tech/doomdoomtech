/*
  Warnings:

  - You are about to drop the column `type` on the `follows` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "follows" DROP COLUMN "type";

-- DropEnum
DROP TYPE "FollowType";
