/*
  Warnings:

  - You are about to drop the column `score` on the `Freelancer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Freelancer" DROP COLUMN "score";

-- CreateTable
CREATE TABLE "ProjectFreelancerScore" (
    "id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "freelancer_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ProjectFreelancerScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProjectFreelancerScore_project_id_freelancer_id_key" ON "ProjectFreelancerScore"("project_id", "freelancer_id");

-- AddForeignKey
ALTER TABLE "ProjectFreelancerScore" ADD CONSTRAINT "ProjectFreelancerScore_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFreelancerScore" ADD CONSTRAINT "ProjectFreelancerScore_freelancer_id_fkey" FOREIGN KEY ("freelancer_id") REFERENCES "Freelancer"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
