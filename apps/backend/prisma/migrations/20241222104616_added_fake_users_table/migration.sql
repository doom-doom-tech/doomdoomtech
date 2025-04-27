-- CreateTable
CREATE TABLE "user_genres" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "genreID" INTEGER NOT NULL,
    "subgenreID" INTEGER NOT NULL,

    CONSTRAINT "user_genres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_genres_userID_key" ON "user_genres"("userID");

-- CreateIndex
CREATE INDEX "user_genres_userID_idx" ON "user_genres"("userID");

-- CreateIndex
CREATE INDEX "user_genres_genreID_idx" ON "user_genres"("genreID");

-- CreateIndex
CREATE INDEX "user_genres_subgenreID_idx" ON "user_genres"("subgenreID");

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_genreID_fkey" FOREIGN KEY ("genreID") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_genres" ADD CONSTRAINT "user_genres_subgenreID_fkey" FOREIGN KEY ("subgenreID") REFERENCES "subgenres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
