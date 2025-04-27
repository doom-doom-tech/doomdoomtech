-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "likes_count" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0;
