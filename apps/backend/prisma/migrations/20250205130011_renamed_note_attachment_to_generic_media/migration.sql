/*
  Warnings:

  - You are about to drop the `note_attachments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "note_attachments" DROP CONSTRAINT "note_attachments_albumID_fkey";

-- DropForeignKey
ALTER TABLE "note_attachments" DROP CONSTRAINT "note_attachments_noteMediaID_fkey";

-- DropForeignKey
ALTER TABLE "note_attachments" DROP CONSTRAINT "note_attachments_trackID_fkey";

-- DropForeignKey
ALTER TABLE "note_attachments" DROP CONSTRAINT "note_attachments_userID_fkey";

-- DropTable
DROP TABLE "note_attachments";

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "noteMediaID" INTEGER,
    "trackID" INTEGER,
    "userID" INTEGER,
    "albumID" INTEGER,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "media_userID_idx" ON "media"("userID");

-- CreateIndex
CREATE INDEX "media_albumID_idx" ON "media"("albumID");

-- CreateIndex
CREATE INDEX "media_trackID_idx" ON "media"("trackID");

-- CreateIndex
CREATE INDEX "media_noteMediaID_idx" ON "media"("noteMediaID");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_noteMediaID_fkey" FOREIGN KEY ("noteMediaID") REFERENCES "note_media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
