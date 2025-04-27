/*
  Warnings:

  - You are about to drop the column `tagID` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the `label_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "label_tags" DROP CONSTRAINT "label_tags_userID_fkey";

-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_tagID_fkey";

-- DropIndex
DROP INDEX "tracks_tagID_idx";

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "tagID";

-- DropTable
DROP TABLE "label_tags";

-- CreateTable
CREATE TABLE "track_tags" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "track_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "track_tags_tag_idx" ON "track_tags"("tag");

-- CreateIndex
CREATE INDEX "track_tags_trackID_idx" ON "track_tags"("trackID");

-- AddForeignKey
ALTER TABLE "track_tags" ADD CONSTRAINT "track_tags_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
