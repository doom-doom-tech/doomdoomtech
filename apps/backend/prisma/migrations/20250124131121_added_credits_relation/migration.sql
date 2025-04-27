-- CreateTable
CREATE TABLE "credits" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credits_userID_key" ON "credits"("userID");

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
