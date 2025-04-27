/*
  Warnings:

  - The primary key for the `list_tracks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "list_tracks" DROP CONSTRAINT "list_tracks_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "list_tracks_pkey" PRIMARY KEY ("id");
