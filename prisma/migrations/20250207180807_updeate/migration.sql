-- DropForeignKey
ALTER TABLE "Soort" DROP CONSTRAINT "Soort_leverancierId_fkey";

-- AddForeignKey
ALTER TABLE "Soort" ADD CONSTRAINT "Soort_leverancierId_fkey" FOREIGN KEY ("leverancierId") REFERENCES "Leverancier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
