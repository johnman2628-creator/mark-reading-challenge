-- Auth.js Prisma adapter: User relations and standard User fields

-- Align users table with @auth/prisma-adapter expectations
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "image" TEXT;

-- googleSub is app-specific; keep optional so adapter createUser can succeed
ALTER TABLE "users" ALTER COLUMN "googleSub" DROP NOT NULL;

-- Backfill Auth.js image from legacy photoUrl
UPDATE "users" SET "image" = "photoUrl" WHERE "image" IS NULL AND "photoUrl" IS NOT NULL;

-- Foreign keys for Account and Session (required for adapter include: { user: true })
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'accounts_userId_fkey'
  ) THEN
    ALTER TABLE "accounts"
      ADD CONSTRAINT "accounts_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sessions_userId_fkey'
  ) THEN
    ALTER TABLE "sessions"
      ADD CONSTRAINT "sessions_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
