/*
  Warnings:

  - You are about to drop the column `noteMediaID` on the `media` table. All the data in the column will be lost.
  - Added the required column `mediaID` to the `note_media` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_noteMediaID_fkey";

-- DropIndex
DROP INDEX "media_noteMediaID_idx";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "noteMediaID";

-- AlterTable
ALTER TABLE "note_media" ADD COLUMN     "mediaID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "note_media" ADD CONSTRAINT "note_media_mediaID_fkey" FOREIGN KEY ("mediaID") REFERENCES "media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
