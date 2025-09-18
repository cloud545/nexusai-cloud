/*
  Warnings:

  - You are about to drop the column `geminiApiKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `geminiBaseUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `geminiModelName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "geminiApiKey",
DROP COLUMN "geminiBaseUrl",
DROP COLUMN "geminiModelName",
ADD COLUMN     "qwenApiKey" TEXT,
ADD COLUMN     "qwenModelName" TEXT;
