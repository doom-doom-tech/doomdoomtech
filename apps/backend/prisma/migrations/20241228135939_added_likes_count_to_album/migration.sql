-- AlterTable
ALTER TABLE "albums" ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "likes_count" SET DEFAULT 0,
ALTER COLUMN "comments_count" SET DEFAULT 0,
ALTER COLUMN "loops_count" SET DEFAULT 0;
