-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "family" TEXT NOT NULL DEFAULT 'DefaultFamily',
ADD COLUMN     "subFamily" TEXT NOT NULL DEFAULT 'DefaultSubFamily';

-- AlterTable
ALTER TABLE "OperationPackage" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'DefaultLocation';
