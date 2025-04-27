-- CreateTable
CREATE TABLE "track_plays" (
    "id" SERIAL NOT NULL,
    "trackID" INTEGER NOT NULL,
    "day" INTEGER NOT NULL DEFAULT 0,
    "week" INTEGER NOT NULL DEFAULT 0,
    "month" INTEGER NOT NULL DEFAULT 0,
    "overall" INTEGER NOT NULL DEFAULT 0,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_plays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_plays_trackID_key" ON "track_plays"("trackID");

-- CreateIndex
CREATE INDEX "track_plays_trackID_idx" ON "track_plays"("trackID");

-- CreateIndex
CREATE INDEX "track_plays_created_trackID_idx" ON "track_plays"("created", "trackID");

-- AddForeignKey
ALTER TABLE "track_plays" ADD CONSTRAINT "track_plays_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
