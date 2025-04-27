/*
  Warnings:

  - You are about to drop the `track_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "track_tags" DROP CONSTRAINT "track_tags_trackID_fkey";

-- DropTable
DROP TABLE "track_tags";

-- CreateTable
CREATE TABLE "tagged_tracks" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "tagged_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tagged_tracks_userID_idx" ON "tagged_tracks"("userID");

-- CreateIndex
CREATE INDEX "tagged_tracks_trackID_idx" ON "tagged_tracks"("trackID");

-- AddForeignKey
ALTER TABLE "tagged_tracks" ADD CONSTRAINT "tagged_tracks_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tagged_tracks" ADD CONSTRAINT "tagged_tracks_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
