/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `albums` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `notes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `tracks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "video_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "albums_uuid_key" ON "albums"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "notes_uuid_key" ON "notes"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_uuid_key" ON "tracks"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");
