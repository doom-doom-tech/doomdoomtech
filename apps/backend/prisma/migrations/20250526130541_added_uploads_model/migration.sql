-- CreateEnum
CREATE TYPE "UploadStatus" AS ENUM ('Pending', 'Processing', 'Completed');

-- CreateTable
CREATE TABLE "uploads" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "cover_url" TEXT,
    "audio_url" TEXT,
    "video_url" TEXT,
    "status" "UploadStatus" NOT NULL DEFAULT 'Pending',
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uploads_userID_key" ON "uploads"("userID");

-- CreateIndex
CREATE INDEX "uploads_userID_idx" ON "uploads"("userID");

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
