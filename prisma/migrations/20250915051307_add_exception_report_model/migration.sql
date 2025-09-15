-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'RESOLVED', 'IGNORED');

-- CreateTable
CREATE TABLE "ExceptionReport" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "accountId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "task" JSONB NOT NULL,
    "failedAction" TEXT NOT NULL,
    "failedSelector" TEXT,
    "pageUrl" TEXT NOT NULL,
    "htmlSnapshot" TEXT NOT NULL,
    "screenshotBase64" TEXT NOT NULL,

    CONSTRAINT "ExceptionReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExceptionReport" ADD CONSTRAINT "ExceptionReport_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
