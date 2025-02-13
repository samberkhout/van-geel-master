-- CreateTable
CREATE TABLE "QSMgroei" (
    "id" SERIAL NOT NULL,
    "weekNummer" INTEGER NOT NULL,
    "jaar" INTEGER NOT NULL,
    "soort" TEXT NOT NULL,
    "groei" INTEGER NOT NULL,

    CONSTRAINT "QSMgroei_pkey" PRIMARY KEY ("id")
);
