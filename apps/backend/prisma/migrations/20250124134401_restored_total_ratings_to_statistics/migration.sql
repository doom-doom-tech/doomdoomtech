-- AlterTable
ALTER TABLE "track_metrics" ADD COLUMN     "total_ratings" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "track_statistics" ADD COLUMN     "total_ratings" INTEGER NOT NULL DEFAULT 0;
