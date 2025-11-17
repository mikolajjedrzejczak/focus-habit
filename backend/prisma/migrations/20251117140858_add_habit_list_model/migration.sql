/*
  Warnings:

  - You are about to drop the column `userId` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `listId` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Habit" DROP CONSTRAINT "Habit_userId_fkey";

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "userId",
ADD COLUMN     "listId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "HabitList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HabitList_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HabitList" ADD CONSTRAINT "HabitList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_listId_fkey" FOREIGN KEY ("listId") REFERENCES "HabitList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
