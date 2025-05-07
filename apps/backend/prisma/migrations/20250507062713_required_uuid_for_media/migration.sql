/*
  Warnings:

  - Made the column `uuid` on table `media` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "media" ALTER COLUMN "uuid" SET NOT NULL;
