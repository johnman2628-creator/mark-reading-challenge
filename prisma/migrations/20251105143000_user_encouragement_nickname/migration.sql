-- AlterTable
ALTER TABLE "users" ADD COLUMN "encouragement_nickname" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_encouragement_nickname_key" ON "users"("encouragement_nickname");
