/*
  Warnings:

  - You are about to drop the column `audio_url` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `cover_url` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `video_url` on the `uploads` table. All the data in the column will be lost.
  - Added the required column `payload` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "uploads" DROP COLUMN "audio_url",
DROP COLUMN "cover_url",
DROP COLUMN "title",
DROP COLUMN "video_url",
ADD COLUMN     "payload" JSONB NOT NULL;
