/*
  Warnings:

  - You are about to drop the column `oppotWeek` on the `scout` table. All the data in the column will be lost.
  - Added the required column `oppotweek` to the `scout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "scout" DROP COLUMN "oppotWeek",
ADD COLUMN     "oppotweek" INTEGER NOT NULL;
