-- CreateEnum
CREATE TYPE "LabelVerificationStatus" AS ENUM ('Pending', 'Declined', 'Completed');

-- CreateTable
CREATE TABLE "label_verifications" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "status" "LabelVerificationStatus" NOT NULL,

    CONSTRAINT "label_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "label_verifications_userID_key" ON "label_verifications"("userID");

-- AddForeignKey
ALTER TABLE "label_verifications" ADD CONSTRAINT "label_verifications_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
