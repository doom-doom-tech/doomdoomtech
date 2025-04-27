-- DropForeignKey
ALTER TABLE "conversation_users" DROP CONSTRAINT "conversation_users_userID_fkey";

-- AddForeignKey
ALTER TABLE "conversation_users" ADD CONSTRAINT "conversation_users_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
