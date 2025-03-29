import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import EditPackagePageClient from "./EditPackagePageClient"

export const metadata: Metadata = {
  title: "Edit Package | Inventory Management System",
  description: "Edit an existing package",
}

interface PackagePageProps {
  params: {
    packageId: string
  }
}

export default async function EditPackagePage({ params }: PackagePageProps) {
  // Get authenticated user
  const user = await getAuthenticatedUser()
  const { packageId } = params

  // Fetch the package
  const packageData = await prisma.package.findUnique({
    where: {
      id: packageId,
    },
    include: {
      image: true,
      packageItems: {
        include: {
          item: {
            include: {
              image: true,
              category: true,
              family: true,
              subFamily: true,
            },
          },
        },
      },
    },
  })

  if (!packageData) {
    return notFound()
  }

  // Get all items for selection
  const items = await prisma.item.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      image: true,
      category: true,
      family: true,
      subFamily: true,
    },
  })

  // Format the package data to match the form schema
  const formattedPackage = {
    name: packageData.name,
    description: packageData.description || "",
    year: packageData.year || undefined,
    location: packageData.location || "",
    active: packageData.active,
    image: packageData.image
      ? {
          url: packageData.image.url,
          key: packageData.image.key,
        }
      : undefined,
    packageItems: packageData.packageItems.map((pi) => ({
      itemId: pi.itemId,
      quantity: pi.quantity,
    })),
  }

  return <EditPackagePageClient packageData={formattedPackage} packageId={packageId} items={items} />
}

