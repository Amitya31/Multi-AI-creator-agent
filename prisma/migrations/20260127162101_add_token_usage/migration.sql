-- AlterTable
ALTER TABLE "TaskResult" ADD COLUMN     "completionTokens" INTEGER,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "promptTokens" INTEGER,
ADD COLUMN     "totalTokens" INTEGER;
