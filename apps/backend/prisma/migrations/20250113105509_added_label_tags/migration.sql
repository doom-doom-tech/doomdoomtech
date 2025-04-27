-- AlterTable
ALTER TABLE "tracks" ADD COLUMN     "tagID" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "label" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "label_tags" (
    "id" SERIAL NOT NULL,
    "tag" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "label_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "label_tags_tag_key" ON "label_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "label_tags_userID_key" ON "label_tags"("userID");

-- CreateIndex
CREATE INDEX "label_tags_tag_idx" ON "label_tags"("tag");

-- CreateIndex
CREATE INDEX "label_tags_userID_idx" ON "label_tags"("userID");

-- CreateIndex
CREATE INDEX "tracks_tagID_idx" ON "tracks"("tagID");

-- CreateIndex
CREATE INDEX "users_uuid_idx" ON "users"("uuid");

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_tagID_fkey" FOREIGN KEY ("tagID") REFERENCES "label_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "label_tags" ADD CONSTRAINT "label_tags_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
