-- CreateTable
CREATE TABLE "track_metrics" (
    "id" SERIAL NOT NULL,
    "average_playtime" INTEGER NOT NULL DEFAULT 0,
    "average_list_position" INTEGER NOT NULL DEFAULT 0,
    "average_rating" INTEGER NOT NULL DEFAULT 0,
    "trackID" INTEGER,

    CONSTRAINT "track_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_metrics_trackID_key" ON "track_metrics"("trackID");

-- CreateIndex
CREATE INDEX "track_metrics_trackID_idx" ON "track_metrics"("trackID");

-- AddForeignKey
ALTER TABLE "track_metrics" ADD CONSTRAINT "track_metrics_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
