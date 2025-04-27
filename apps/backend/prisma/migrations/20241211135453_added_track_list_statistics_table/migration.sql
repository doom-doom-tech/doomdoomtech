-- CreateTable
CREATE TABLE "track_list_statistics" (
    "trackUUID" TEXT NOT NULL,
    "list_position_sum" INTEGER NOT NULL,
    "list_position_count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "track_list_statistics_trackUUID_key" ON "track_list_statistics"("trackUUID");

-- CreateIndex
CREATE INDEX "track_list_statistics_trackUUID_idx" ON "track_list_statistics"("trackUUID");

-- CreateIndex
CREATE INDEX "track_list_statistics_list_position_sum_list_position_count_idx" ON "track_list_statistics"("list_position_sum", "list_position_count");
