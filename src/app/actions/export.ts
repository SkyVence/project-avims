"use server"

import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"

/**
 * Fetches detailed data for a specific operation
 * 
 * @param operationId - The ID of the operation to fetch
 * @param includeItems - Whether to include detailed item data
 * @returns Detailed operation data including items if requested
 */
export async function fetchOperationDetails(operationId: string, includeItems: boolean) {
  const user = await getAuthenticatedUser()
  
  // Base query to get operation details
  const operation = await prisma.operation.findUnique({
    where: {
      id: operationId,
      userId: user.id, // Ensure the operation belongs to the user
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      year: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  if (!operation) {
    throw new Error(`Operation with ID ${operationId} not found`)
  }
  
  // If detailed items are requested, fetch them
  if (includeItems) {
    // Fetch items in this operation
    const operationItems = await prisma.operationItem.findMany({
      where: {
        operationId,
        itemId: {
          not: null,
        },
      },
      select: {
        id: true,
        quantity: true,
        item: {
          select: {
            id: true,
            name: true,
            description: true,
            brand: true,
            value: true,
            insuranceValue: true,
            hsCode: true,
            location: true,
            length: true,
            width: true,
            height: true,
            weight: true,
            quantity: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            family: {
              select: {
                id: true,
                name: true,
              },
            },
            subFamily: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    
    // Fetch packages in this operation
    const operationPackages = await prisma.operationItem.findMany({
      where: {
        operationId,
        packageId: {
          not: null,
        },
      },
      select: {
        id: true,
        quantity: true,
        packageId: true,
        package: {
          select: {
            id: true,
            name: true,
            description: true,
            location: true,
            year: true,
          },
        },
      },
    })
    
    // Map the items to a simpler format
    const items = operationItems.map(oi => ({
      id: oi.item?.id,
      name: oi.item?.name,
      description: oi.item?.description,
      brand: oi.item?.brand,
      value: oi.item?.value,
      insuranceValue: oi.item?.insuranceValue,
      hsCode: oi.item?.hsCode,
      location: oi.item?.location,
      length: oi.item?.length,
      width: oi.item?.width,
      height: oi.item?.height,
      weight: oi.item?.weight,
      quantity: oi.quantity,
      category: oi.item?.category,
      family: oi.item?.family,
      subFamily: oi.item?.subFamily,
    }))
    
    // Return operation with items and packages
    return {
      ...operation,
      items,
      packages: operationPackages,
    }
  }
  
  // Return just the operation if detailed items aren't requested
  return operation
}

/**
 * Fetches detailed data for a specific package
 * 
 * @param packageId - The ID of the package to fetch
 * @param includeItems - Whether to include detailed item data
 * @returns Detailed package data including items if requested
 */
export async function fetchPackageDetails(packageId: string, includeItems: boolean) {
  const user = await getAuthenticatedUser()
  
  // Base query to get package details
  const pkg = await prisma.package.findUnique({
    where: {
      id: packageId,
      userId: user.id, // Ensure the package belongs to the user
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      year: true,
      active: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  
  if (!pkg) {
    throw new Error(`Package with ID ${packageId} not found`)
  }
  
  // If detailed items are requested, fetch them
  if (includeItems) {
    // Fetch items in this package
    const packageItems = await prisma.packageItem.findMany({
      where: {
        packageId,
      },
      select: {
        id: true,
        quantity: true,
        item: {
          select: {
            id: true,
            name: true,
            description: true,
            brand: true,
            value: true,
            insuranceValue: true,
            hsCode: true,
            location: true,
            length: true,
            width: true,
            height: true,
            weight: true,
            quantity: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            family: {
              select: {
                id: true,
                name: true,
              },
            },
            subFamily: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    })
    
    // Map the items to a simpler format
    const items = packageItems.map(pi => ({
      id: pi.item.id,
      name: pi.item.name,
      description: pi.item.description,
      brand: pi.item.brand,
      value: pi.item.value,
      insuranceValue: pi.item.insuranceValue,
      hsCode: pi.item.hsCode,
      location: pi.item.location,
      length: pi.item.length,
      width: pi.item.width,
      height: pi.item.height,
      weight: pi.item.weight,
      quantity: pi.quantity,
      category: pi.item.category,
      family: pi.item.family,
      subFamily: pi.item.subFamily,
    }))
    
    // Return package with items
    return {
      ...pkg,
      items,
    }
  }
  
  // Return just the package if detailed items aren't requested
  return pkg
} 