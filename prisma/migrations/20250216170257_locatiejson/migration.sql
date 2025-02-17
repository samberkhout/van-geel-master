
-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "locatie",
ADD COLUMN     "locatie" JSONB NOT NULL;
