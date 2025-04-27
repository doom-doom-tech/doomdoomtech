-- CreateEnum
CREATE TYPE "FeedItemType" AS ENUM ('Note', 'Track', 'Album');

-- CreateTable
CREATE TABLE "feed_items" (
    "id" SERIAL NOT NULL,
    "entityType" "FeedItemType" NOT NULL,
    "entityID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trackID" INTEGER,
    "albumID" INTEGER,
    "noteID" INTEGER,

    CONSTRAINT "feed_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feed_item_users" (
    "userID" INTEGER NOT NULL,
    "itemID" INTEGER NOT NULL
);

-- CreateIndex
CREATE INDEX "feed_items_entityType_entityID_idx" ON "feed_items"("entityType", "entityID");

-- CreateIndex
CREATE INDEX "feed_items_created_idx" ON "feed_items"("created");

-- CreateIndex
CREATE INDEX "feed_item_users_userID_idx" ON "feed_item_users"("userID");

-- CreateIndex
CREATE INDEX "feed_item_users_itemID_idx" ON "feed_item_users"("itemID");

-- CreateIndex
CREATE UNIQUE INDEX "feed_item_users_userID_itemID_key" ON "feed_item_users"("userID", "itemID");

-- AddForeignKey
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_trackID_fkey" FOREIGN KEY ("trackID") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_albumID_fkey" FOREIGN KEY ("albumID") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_items" ADD CONSTRAINT "feed_items_noteID_fkey" FOREIGN KEY ("noteID") REFERENCES "notes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_item_users" ADD CONSTRAINT "feed_item_users_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feed_item_users" ADD CONSTRAINT "feed_item_users_itemID_fkey" FOREIGN KEY ("itemID") REFERENCES "feed_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
