/*
  Warnings:

  - You are about to drop the column `average_rating` on the `track_metrics` table. All the data in the column will be lost.
  - You are about to drop the column `average_rating` on the `track_statistics` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "LikeableEntity" ADD VALUE 'Track';

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "track_metrics" DROP COLUMN "average_rating";

-- AlterTable
ALTER TABLE "track_statistics" DROP COLUMN "average_rating",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "track_statistics_pkey" PRIMARY KEY ("id");
