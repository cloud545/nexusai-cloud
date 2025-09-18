-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('NEW', 'MATURE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "geminiBaseUrl" TEXT,
ADD COLUMN     "geminiModelName" TEXT;

-- CreateTable
CREATE TABLE "FacebookAccount" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "encryptedCredential" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'NEW',
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "assignedPersonaId" TEXT,

    CONSTRAINT "FacebookAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Persona" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mission" TEXT NOT NULL,
    "personality" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Persona_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacebookAccount_assignedPersonaId_key" ON "FacebookAccount"("assignedPersonaId");

-- AddForeignKey
ALTER TABLE "FacebookAccount" ADD CONSTRAINT "FacebookAccount_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacebookAccount" ADD CONSTRAINT "FacebookAccount_assignedPersonaId_fkey" FOREIGN KEY ("assignedPersonaId") REFERENCES "Persona"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Persona" ADD CONSTRAINT "Persona_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
