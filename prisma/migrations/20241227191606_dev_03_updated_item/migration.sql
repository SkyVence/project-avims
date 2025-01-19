/*
  Warnings:

  - Added the required column `assuranceValue` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfPurchase` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weigth` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `OperationPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "assuranceValue" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "dateOfPurchase" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "origin" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weigth" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "width" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "family" DROP DEFAULT,
ALTER COLUMN "subFamily" DROP DEFAULT;

-- AlterTable
ALTER TABLE "OperationPackage" ADD COLUMN     "year" TEXT NOT NULL;
