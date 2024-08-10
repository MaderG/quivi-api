/*
  Warnings:

  - Added the required column `location` to the `Freelancer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Freelancer" ADD COLUMN     "location" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "photo" TEXT;
