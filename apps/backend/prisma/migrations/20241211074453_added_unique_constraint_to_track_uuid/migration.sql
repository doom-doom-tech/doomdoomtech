/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `tracks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tracks_uuid_key" ON "tracks"("uuid");
