/*
  Warnings:

  - A unique constraint covering the columns `[packageId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[operationId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Image_packageId_key" ON "Image"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_operationId_key" ON "Image"("operationId");
