-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "trackID" INTEGER,
    "albumID" INTEGER,
    "noteID" INTEGER,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_userID_idx" ON "likes"("userID");

-- CreateIndex
CREATE INDEX "likes_trackID_idx" ON "likes"("trackID");

-- CreateIndex
CREATE INDEX "likes_albumID_idx" ON "likes"("albumID");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
