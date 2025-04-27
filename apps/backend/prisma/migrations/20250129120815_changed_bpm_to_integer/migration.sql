/*
  Warnings:

  - The `bpm` column on the `tracks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "bpm",
ADD COLUMN     "bpm" INTEGER;

-- CreateIndex
CREATE INDEX "tracks_bpm_idx" ON "tracks"("bpm");
