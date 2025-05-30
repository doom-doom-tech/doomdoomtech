/*
  Warnings:

  - A unique constraint covering the columns `[trackID]` on the table `uploads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackID` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "uploads_userID_key";

-- AlterTable
ALTER TABLE "uploads" ADD COLUMN     "trackID" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "uploads_trackID_key" ON "uploads"("trackID");

-- CreateIndex
CREATE INDEX "uploads_trackID_idx" ON "uploads"("trackID");

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
