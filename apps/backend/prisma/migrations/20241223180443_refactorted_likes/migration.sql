/*
  Warnings:

  - You are about to drop the `likes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `likes_count` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "likes" DROP CONSTRAINT "likes_userID_fkey";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "likes_count" INTEGER NOT NULL;

-- DropTable
DROP TABLE "likes";

-- DropEnum
DROP TYPE "LikableEntity";

-- CreateTable
CREATE TABLE "liked_comments" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "commentID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liked_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liked_notes" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "noteID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "liked_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "liked_comments_commentID_idx" ON "liked_comments"("commentID");

-- CreateIndex
CREATE INDEX "liked_comments_userID_idx" ON "liked_comments"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "liked_comments_userID_commentID_key" ON "liked_comments"("userID", "commentID");

-- CreateIndex
CREATE INDEX "liked_notes_noteID_idx" ON "liked_notes"("noteID");

-- CreateIndex
CREATE INDEX "liked_notes_userID_idx" ON "liked_notes"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "liked_notes_userID_noteID_key" ON "liked_notes"("userID", "noteID");

-- AddForeignKey
ALTER TABLE "liked_comments" ADD CONSTRAINT "liked_comments_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_comments" ADD CONSTRAINT "liked_comments_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_notes" ADD CONSTRAINT "liked_notes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liked_notes" ADD CONSTRAINT "liked_notes_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
