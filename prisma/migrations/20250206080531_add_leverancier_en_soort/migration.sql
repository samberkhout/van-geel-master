-- CreateTable
CREATE TABLE "Leverancier" (
    "id" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,

    CONSTRAINT "Leverancier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Soort" (
    "id" SERIAL NOT NULL,
    "naam" TEXT NOT NULL,
    "leverancierId" INTEGER NOT NULL,

    CONSTRAINT "Soort_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Leverancier_naam_key" ON "Leverancier"("naam");

-- AddForeignKey
ALTER TABLE "Soort" ADD CONSTRAINT "Soort_leverancierId_fkey" FOREIGN KEY ("leverancierId") REFERENCES "Leverancier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
