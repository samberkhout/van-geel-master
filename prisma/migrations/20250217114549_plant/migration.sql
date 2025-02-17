/*
  Warnings:

  - You are about to drop the column `soort` on the `Trips` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plantId]` on the table `Oppotten` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plantId]` on the table `Trips` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plantId]` on the table `ZiekZoeken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[plantId]` on the table `scout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plantId` to the `Oppotten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ras` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `ZiekZoeken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plantId` to the `scout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Oppotten" ADD COLUMN     "plantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "soort",
ADD COLUMN     "plantId" INTEGER NOT NULL,
ADD COLUMN     "ras" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ZiekZoeken" ADD COLUMN     "plantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "scout" ADD COLUMN     "plantId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "ras" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Oppotten_plantId_key" ON "Oppotten"("plantId");

-- CreateIndex
CREATE UNIQUE INDEX "Trips_plantId_key" ON "Trips"("plantId");

-- CreateIndex
CREATE UNIQUE INDEX "ZiekZoeken_plantId_key" ON "ZiekZoeken"("plantId");

-- CreateIndex
CREATE UNIQUE INDEX "scout_plantId_key" ON "scout"("plantId");

-- AddForeignKey
ALTER TABLE "Oppotten" ADD CONSTRAINT "Oppotten_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZiekZoeken" ADD CONSTRAINT "ZiekZoeken_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scout" ADD CONSTRAINT "scout_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
