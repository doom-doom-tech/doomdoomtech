-- CreateTable
CREATE TABLE "visits" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "visitorID" INTEGER NOT NULL,
    "created" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "visits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visits" ADD CONSTRAINT "visits_visitorID_fkey" FOREIGN KEY ("visitorID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
