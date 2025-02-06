-- CreateTable
CREATE TABLE "Oppotten" (
    "id" SERIAL NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "ras" TEXT NOT NULL,
    "aantalOpgepot" INTEGER NOT NULL,
    "aantalWeggooi" INTEGER NOT NULL,
    "redenWeggooi" TEXT NOT NULL,
    "andereReden" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Oppotten_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "id" SERIAL NOT NULL,
    "soort" TEXT NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "oppotweek" INTEGER NOT NULL,
    "aantalPlanten" INTEGER NOT NULL,
    "locatie" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZiekZoeken" (
    "id" SERIAL NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "ras" TEXT NOT NULL,
    "aantalWeggooi" INTEGER NOT NULL,
    "redenWeggooi" TEXT NOT NULL,
    "andereReden" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ZiekZoeken_pkey" PRIMARY KEY ("id")
);
