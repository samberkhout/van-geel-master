/*
  Warnings:

  - You are about to drop the column `ras` on the `Oppotten` table. All the data in the column will be lost.
  - You are about to drop the column `ras` on the `Plant` table. All the data in the column will be lost.
  - You are about to drop the column `ras` on the `Trips` table. All the data in the column will be lost.
  - You are about to drop the column `ras` on the `ZiekZoeken` table. All the data in the column will be lost.
  - You are about to drop the column `ras` on the `scout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leverancierId,naam]` on the table `Soort` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `soortId` to the `Oppotten` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soortId` to the `Plant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soortId` to the `Trips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soortId` to the `ZiekZoeken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soortId` to the `scout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Oppotten" DROP COLUMN "ras",
ADD COLUMN     "soortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Plant" DROP COLUMN "ras",
ADD COLUMN     "soortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "ras",
ADD COLUMN     "soortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ZiekZoeken" DROP COLUMN "ras",
ADD COLUMN     "soortId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "scout" DROP COLUMN "ras",
ADD COLUMN     "soortId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Soort_leverancierId_naam_key" ON "Soort"("leverancierId", "naam");

-- AddForeignKey
ALTER TABLE "Plant" ADD CONSTRAINT "Plant_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Oppotten" ADD CONSTRAINT "Oppotten_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZiekZoeken" ADD CONSTRAINT "ZiekZoeken_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scout" ADD CONSTRAINT "scout_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE CASCADE ON UPDATE CASCADE;
