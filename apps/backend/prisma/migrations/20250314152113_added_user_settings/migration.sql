-- CreateTable
CREATE TABLE "user_settings" (
    "userID" INTEGER NOT NULL,
    "events" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userID_key" ON "user_settings"("userID");

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
