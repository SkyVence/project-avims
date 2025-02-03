import { prisma } from './prisma';

export const getAllItems = async () => {
  return await prisma.item.findMany({
    where: {},
    include: {
		category: true,
		families: true,
		subfamilies: true,
    }
  });
}

export const getAllPackage = async () => {
  return await prisma.package.findMany({
    where: {},
  });
}

export const getItemForPackage = async (packageId: string) => {
  return await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      items: {
        include: {
          category: true,
          families: true,
          subfamilies: true,
        },
      }
    }
  })
}

export const getAllOperationPackage = async () => {
  return await prisma.operationPackage.findMany({
    where: {},
  });
}

export const getOperationPackageById = async(id: string) => {
  return prisma.operationPackage.findUnique({
    where: { id },
    include: {
      items: true,
      packages: true,
    }
  })
}