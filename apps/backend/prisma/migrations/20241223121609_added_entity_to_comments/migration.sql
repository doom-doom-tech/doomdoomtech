/*
  Warnings:

  - You are about to drop the column `trackID` on the `comments` table. All the data in the column will be lost.
  - Added the required column `entity` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `entityID` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CommentEntityType" AS ENUM ('Track', 'Note');

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_trackID_fkey";

-- DropIndex
DROP INDEX "comments_senderID_idx";

-- DropIndex
DROP INDEX "comments_trackID_idx";

-- DropIndex
DROP INDEX "replies_senderID_idx";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "trackID",
ADD COLUMN     "entity" "CommentEntityType" NOT NULL,
ADD COLUMN     "entityID" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "comments_entity_entityID_idx" ON "comments"("entity", "entityID");
