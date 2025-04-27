/*
  Warnings:

  - You are about to drop the column `premium` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "premium";

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "account" INTEGER NOT NULL,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_userID_key" ON "bank_accounts"("userID");

-- CreateIndex
CREATE INDEX "bank_accounts_userID_idx" ON "bank_accounts"("userID");

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
