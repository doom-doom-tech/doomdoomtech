/*
  Warnings:

  - You are about to drop the column `noteID` on the `note_attachments` table. All the data in the column will be lost.
  - Added the required column `albumID` to the `note_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteMediaID` to the `note_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackID` to the `note_attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `note_attachments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `note_attachments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Image', 'Video', 'File');

-- DropForeignKey
ALTER TABLE "note_attachments" DROP CONSTRAINT "note_attachments_noteID_fkey";

-- DropIndex
DROP INDEX "note_attachments_noteID_idx";

-- AlterTable
ALTER TABLE "note_attachments" DROP COLUMN "noteID",
ADD COLUMN     "albumID" INTEGER NOT NULL,
ADD COLUMN     "noteMediaID" INTEGER NOT NULL,
ADD COLUMN     "trackID" INTEGER NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- DropEnum
DROP TYPE "AttachmentType";

-- CreateTable
CREATE TABLE "note_media" (
    "id" SERIAL NOT NULL,
    "noteID" INTEGER NOT NULL,

    CONSTRAINT "note_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_attachments_userID_idx" ON "note_attachments"("userID");

-- CreateIndex
CREATE INDEX "note_attachments_albumID_idx" ON "note_attachments"("albumID");

-- CreateIndex
CREATE INDEX "note_attachments_trackID_idx" ON "note_attachments"("trackID");

-- CreateIndex
CREATE INDEX "note_attachments_noteMediaID_idx" ON "note_attachments"("noteMediaID");

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_noteMediaID_fkey" FOREIGN KEY ("noteMediaID") REFERENCES "note_media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_media" ADD CONSTRAINT "note_media_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
