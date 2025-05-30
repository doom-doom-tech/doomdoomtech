/*
  Warnings:

  - The required column `uuid` was added to the `albums` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `tracks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "cover_url" TEXT,
ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "uuid" TEXT NOT NULL;
