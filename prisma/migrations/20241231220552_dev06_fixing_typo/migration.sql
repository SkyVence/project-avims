/*
  Warnings:

  - You are about to drop the column `weigth` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "weigth",
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 0;
