-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiProvider" TEXT NOT NULL DEFAULT 'ollama',
ADD COLUMN     "geminiApiKey" TEXT,
ADD COLUMN     "ollamaModel" TEXT;
