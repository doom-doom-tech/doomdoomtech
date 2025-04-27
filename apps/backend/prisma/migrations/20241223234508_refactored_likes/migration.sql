/*
  Warnings:

  - You are about to drop the `liked_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `liked_notes` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LikeableEntity" AS ENUM ('Note', 'Album', 'Comment');

-- DropForeignKey
ALTER TABLE "liked_comments" DROP CONSTRAINT "liked_comments_commentID_fkey";

-- DropForeignKey
ALTER TABLE "liked_comments" DROP CONSTRAINT "liked_comments_userID_fkey";

-- DropForeignKey
ALTER TABLE "liked_notes" DROP CONSTRAINT "liked_notes_noteID_fkey";

-- DropForeignKey
ALTER TABLE "liked_notes" DROP CONSTRAINT "liked_notes_userID_fkey";

-- DropTable
DROP TABLE "liked_comments";

-- DropTable
DROP TABLE "liked_notes";

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "entity" "LikeableEntity" NOT NULL,
    "entityID" INTEGER NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_userID_idx" ON "likes"("userID");

-- CreateIndex
CREATE INDEX "likes_entity_entityID_idx" ON "likes"("entity", "entityID");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userID_entityID_entity_key" ON "likes"("userID", "entityID", "entity");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
