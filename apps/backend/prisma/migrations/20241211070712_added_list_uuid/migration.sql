/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `lists` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `lists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "lists" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "lists_uuid_key" ON "lists"("uuid");
