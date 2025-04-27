/*
  Warnings:

  - You are about to drop the `replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tags` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `parentID` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_parentID_fkey";

-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_senderID_fkey";

-- DropForeignKey
ALTER TABLE "tags" DROP CONSTRAINT "tags_userID_fkey";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "parentID" INTEGER NOT NULL;

-- DropTable
DROP TABLE "replies";

-- DropTable
DROP TABLE "tags";

-- DropEnum
DROP TYPE "TagModel";
