/*
  Warnings:

  - You are about to drop the column `bpm` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `total_assets` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `uploaded_assets` on the `tracks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "tracks_bpm_idx";

-- DropIndex
DROP INDEX "tracks_key_idx";

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "bpm",
DROP COLUMN "key",
DROP COLUMN "total_assets",
DROP COLUMN "uploaded_assets",
ALTER COLUMN "active" SET DEFAULT true;

-- CreateTable
CREATE TABLE "track_metadata" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER,
    "era" TEXT NOT NULL,
    "emotion" TEXT NOT NULL,
    "energy" TEXT NOT NULL,
    "mood" TEXT[],
    "instruments" TEXT[],
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "track_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_metadata_trackID_key" ON "track_metadata"("trackID");

-- AddForeignKey
ALTER TABLE "track_metadata" ADD CONSTRAINT "track_metadata_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
