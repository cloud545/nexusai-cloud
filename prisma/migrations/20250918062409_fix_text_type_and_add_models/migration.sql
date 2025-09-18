/*
  Warnings:

  - Added the required column `errorMessage` to the `ExceptionReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExceptionReport" ADD COLUMN     "errorMessage" TEXT NOT NULL;
