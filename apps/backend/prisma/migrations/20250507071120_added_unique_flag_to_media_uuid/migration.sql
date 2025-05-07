/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `media` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "media_uuid_key" ON "media"("uuid");
