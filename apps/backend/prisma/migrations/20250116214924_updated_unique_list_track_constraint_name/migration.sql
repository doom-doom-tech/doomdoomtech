-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('Image', 'Video', 'File');

-- CreateTable
CREATE TABLE "note_attachments" (
    "id" SERIAL NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "url" TEXT NOT NULL,
    "noteID" INTEGER NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "note_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "note_attachments_noteID_idx" ON "note_attachments"("noteID");

-- AddForeignKey
ALTER TABLE "note_attachments" ADD CONSTRAINT "note_attachments_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
