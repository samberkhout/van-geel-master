-- CreateTable
CREATE TABLE "GemTak" (
    "id" SERIAL NOT NULL,
    "jaar" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "tak1" DOUBLE PRECISION,
    "tak2" DOUBLE PRECISION,
    "tak3" DOUBLE PRECISION,
    "gemTakPerPlant" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GemTak_pkey" PRIMARY KEY ("id")
);
