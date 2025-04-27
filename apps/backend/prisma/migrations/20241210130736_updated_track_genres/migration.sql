/*
  Warnings:

  - Added the required column `group` to the `subgenres` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgenreID` to the `tracks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tracks" DROP CONSTRAINT "tracks_genreID_fkey";

-- AlterTable
ALTER TABLE "subgenres" ADD COLUMN     "group" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "subgenreID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_subgenreID_fkey" FOREIGN KEY ("subgenreID") REFERENCES "subgenres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
