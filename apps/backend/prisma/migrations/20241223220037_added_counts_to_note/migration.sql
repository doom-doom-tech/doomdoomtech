/*
  Warnings:

  - Added the required column `comments_count` to the `notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loops_count` to the `notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "comments_count" INTEGER NOT NULL,
ADD COLUMN     "loops_count" INTEGER NOT NULL,
ALTER COLUMN "likes_count" DROP DEFAULT;
