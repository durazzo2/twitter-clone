/*
  Warnings:

  - The primary key for the `Retweet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Retweet` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Retweet_userId_postId_key";

-- AlterTable
ALTER TABLE "Retweet" DROP CONSTRAINT "Retweet_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Retweet_pkey" PRIMARY KEY ("userId", "postId");
