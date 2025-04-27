/*
  Warnings:

  - You are about to drop the `track_actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `track_totals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "track_actions" DROP CONSTRAINT "track_actions_trackID_fkey";

-- DropForeignKey
ALTER TABLE "track_totals" DROP CONSTRAINT "track_totals_trackID_fkey";

-- AlterTable
ALTER TABLE "track_metrics" ADD COLUMN     "total_comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_lists" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_plays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_playtime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_ratings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_shares" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "track_statistics" ADD COLUMN     "total_comments" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_lists" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_plays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_playtime" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_ratings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_shares" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_views" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "track_actions";

-- DropTable
DROP TABLE "track_totals";
