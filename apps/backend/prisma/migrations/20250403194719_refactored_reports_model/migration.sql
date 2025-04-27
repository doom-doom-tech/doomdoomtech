/*
  Warnings:

  - You are about to drop the column `entity` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `entityID` on the `reports` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `reports` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_userID_fkey";

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "entity",
DROP COLUMN "entityID",
DROP COLUMN "reason",
ADD COLUMN     "albumID" INTEGER,
ADD COLUMN     "commentID" INTEGER,
ADD COLUMN     "noteID" INTEGER,
ADD COLUMN     "trackID" INTEGER;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
