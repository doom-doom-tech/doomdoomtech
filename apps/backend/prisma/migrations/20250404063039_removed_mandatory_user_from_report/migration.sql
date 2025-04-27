/*
  Warnings:

  - You are about to drop the column `userID` on the `reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userID_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "userID";
