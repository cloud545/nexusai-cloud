-- CreateTable
CREATE TABLE "SelectorKnowledge" (
    "id" TEXT NOT NULL,
    "pageType" TEXT NOT NULL,
    "elementName" TEXT NOT NULL,
    "selector" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 10,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SelectorKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SelectorKnowledge_pageType_elementName_key" ON "SelectorKnowledge"("pageType", "elementName");
