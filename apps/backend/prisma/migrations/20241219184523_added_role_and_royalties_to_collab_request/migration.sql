/*
  Warnings:

  - Added the required column `role` to the `collab_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `royalties` to the `collab_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "collab_requests" ADD COLUMN     "role" "TrackArtistRole" NOT NULL,
ADD COLUMN     "royalties" INTEGER NOT NULL;
