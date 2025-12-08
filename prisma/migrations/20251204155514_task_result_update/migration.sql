/*
  Warnings:

  - Added the required column `type` to the `TaskResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaskResult" ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "agentId" DROP NOT NULL;
