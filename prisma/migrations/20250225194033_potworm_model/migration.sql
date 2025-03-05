-- CreateTable
CREATE TABLE "Potworm" (
    "id" SERIAL NOT NULL,
    "jaar" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "afd1" DOUBLE PRECISION,
    "afd16" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Potworm_pkey" PRIMARY KEY ("id")
);
