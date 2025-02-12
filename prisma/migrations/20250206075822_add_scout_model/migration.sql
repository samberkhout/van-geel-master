-- CreateTable
CREATE TABLE "scout" (
    "id" TEXT NOT NULL,
    "leverweek" INTEGER NOT NULL,
    "ras" TEXT NOT NULL,
    "oppotWeek" INTEGER NOT NULL,
    "bio" INTEGER NOT NULL,
    "oorwoorm" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scout_pkey" PRIMARY KEY ("id")
);
