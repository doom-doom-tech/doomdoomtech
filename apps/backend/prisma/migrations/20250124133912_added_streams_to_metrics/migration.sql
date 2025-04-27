/*
  Warnings:

  - You are about to drop the column `average_playtime` on the `track_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `total_ratings` on the `track_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `average_playtime` on the `track_statistics` table. All the data in the column will be lost.
  - You are about to drop the column `total_ratings` on the `track_statistics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "track_metrics" DROP COLUMN "average_playtime",
DROP COLUMN "total_ratings",
ADD COLUMN     "total_streams" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "track_statistics" DROP COLUMN "average_playtime",
DROP COLUMN "total_ratings",
ADD COLUMN     "total_streams" INTEGER NOT NULL DEFAULT 0;
