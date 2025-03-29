/*
  Warnings:

  - Made the column `brand` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `insuranceValue` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hsCode` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weight` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `categoryId` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `familyId` on table `Item` required. This step will fail if there are existing NULL values in that column.
  - Made the column `subFamilyId` on table `Item` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_familyId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_subFamilyId_fkey";

-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "insuranceValue" SET NOT NULL,
ALTER COLUMN "hsCode" SET NOT NULL,
ALTER COLUMN "location" SET NOT NULL,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "weight" SET NOT NULL,
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "familyId" SET NOT NULL,
ALTER COLUMN "subFamilyId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_subFamilyId_fkey" FOREIGN KEY ("subFamilyId") REFERENCES "SubFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
