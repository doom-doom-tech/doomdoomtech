/*
  Warnings:

  - Added the required column `role` to the `track_artists` table without a default value. This is not possible if the table is not empty.
  - Added the required column `royalties` to the `track_artists` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TrackArtistRole" AS ENUM ('Artist', 'Producer', 'Songwriter');

-- AlterTable
ALTER TABLE "track_artists" ADD COLUMN     "role" "TrackArtistRole" NOT NULL,
ADD COLUMN     "royalties" INTEGER NOT NULL;
