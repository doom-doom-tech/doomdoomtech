/*
  Warnings:

  - You are about to drop the column `uuid` on the `albums` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `notes` table. All the data in the column will be lost.
  - The primary key for the `track_statistics` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `track_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `average_rating` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `total_comments_count` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `uuid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `plays` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_interactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_list_statistics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_ratings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_views` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_genres` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "track_interactions" DROP CONSTRAINT "track_interactions_trackID_fkey";

-- DropForeignKey
ALTER TABLE "track_ratings" DROP CONSTRAINT "track_ratings_trackID_fkey";

-- DropForeignKey
ALTER TABLE "track_ratings" DROP CONSTRAINT "track_ratings_userID_fkey";

-- DropForeignKey
ALTER TABLE "track_views" DROP CONSTRAINT "track_views_trackID_fkey";

-- DropForeignKey
ALTER TABLE "track_views" DROP CONSTRAINT "track_views_userID_fkey";

-- DropForeignKey
ALTER TABLE "user_genres" DROP CONSTRAINT "user_genres_genreID_fkey";

-- DropForeignKey
ALTER TABLE "user_genres" DROP CONSTRAINT "user_genres_userID_fkey";

-- DropIndex
DROP INDEX "albums_uuid_key";

-- DropIndex
DROP INDEX "tracks_uuid_idx";

-- DropIndex
DROP INDEX "tracks_uuid_key";

-- DropIndex
DROP INDEX "users_uuid_key";

-- AlterTable
ALTER TABLE "albums" DROP COLUMN "uuid";

-- AlterTable
ALTER TABLE "notes" DROP COLUMN "uuid";

-- AlterTable
ALTER TABLE "track_statistics" DROP CONSTRAINT "track_statistics_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "average_rating",
DROP COLUMN "total_comments_count",
DROP COLUMN "uuid";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "uuid";

-- DropTable
DROP TABLE "plays";

-- DropTable
DROP TABLE "track_interactions";

-- DropTable
DROP TABLE "track_list_statistics";

-- DropTable
DROP TABLE "track_ratings";

-- DropTable
DROP TABLE "track_views";

-- DropTable
DROP TABLE "user_genres";

-- CreateTable
CREATE TABLE "track_actions" (
    "list" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "plays" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "ratings" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "track_totals" (
    "lists" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "plays" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "ratings" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "trackID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "track_actions_trackID_idx" ON "track_actions"("trackID");

-- CreateIndex
CREATE INDEX "track_actions_created_trackID_idx" ON "track_actions"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_actions_created_trackID_key" ON "track_actions"("created", "trackID");

-- CreateIndex
CREATE UNIQUE INDEX "track_totals_trackID_key" ON "track_totals"("trackID");

-- CreateIndex
CREATE INDEX "track_totals_trackID_idx" ON "track_totals"("trackID");

-- CreateIndex
CREATE INDEX "track_totals_created_trackID_idx" ON "track_totals"("created", "trackID");

-- CreateIndex
CREATE INDEX "alert_queue_alertID_idx" ON "alert_queue"("alertID");

-- CreateIndex
CREATE INDEX "alert_users_userID_idx" ON "alert_users"("userID");

-- CreateIndex
CREATE INDEX "alert_users_alertID_idx" ON "alert_users"("alertID");

-- CreateIndex
CREATE INDEX "comments_senderID_idx" ON "comments"("senderID");

-- CreateIndex
CREATE INDEX "comments_trackID_idx" ON "comments"("trackID");

-- CreateIndex
CREATE INDEX "devices_userID_idx" ON "devices"("userID");

-- CreateIndex
CREATE INDEX "likes_userID_idx" ON "likes"("userID");

-- CreateIndex
CREATE INDEX "likes_entityID_idx" ON "likes"("entityID");

-- CreateIndex
CREATE INDEX "messages_senderID_idx" ON "messages"("senderID");

-- CreateIndex
CREATE INDEX "replies_senderID_idx" ON "replies"("senderID");

-- CreateIndex
CREATE INDEX "replies_parentID_idx" ON "replies"("parentID");

-- CreateIndex
CREATE INDEX "tags_userID_idx" ON "tags"("userID");

-- AddForeignKey
ALTER TABLE "track_actions" ADD CONSTRAINT "track_actions_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_totals" ADD CONSTRAINT "track_totals_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
