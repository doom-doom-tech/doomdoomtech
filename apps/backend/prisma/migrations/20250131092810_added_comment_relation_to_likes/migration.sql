-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "commentID" INTEGER;

-- CreateIndex
CREATE INDEX "likes_commentID_idx" ON "likes"("commentID");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
