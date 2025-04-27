/*
  Warnings:

  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userID_fkey";

-- AlterTable
ALTER TABLE "track_metrics" ADD COLUMN     "total_likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "track_statistics" ADD COLUMN     "total_likes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "likes";

-- DropEnum
DROP TYPE "LikeableEntity";
