/*
  Warnings:

  - Made the column `updated_at` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."PostStatus" AS ENUM ('active', 'hidden', 'archived');

-- AlterTable
ALTER TABLE "public"."posts" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "is_hidden" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "public"."PostStatus" NOT NULL DEFAULT 'active',
ALTER COLUMN "updated_at" SET NOT NULL;

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "public"."posts"("status");
