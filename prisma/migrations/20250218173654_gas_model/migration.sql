-- CreateTable
CREATE TABLE "gas" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "soortId" INTEGER NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "gasweek" INTEGER NOT NULL,
    "aantal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "gas" ADD CONSTRAINT "gas_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gas" ADD CONSTRAINT "gas_soortId_fkey" FOREIGN KEY ("soortId") REFERENCES "Soort"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
