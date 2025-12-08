-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_agentId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "agentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
