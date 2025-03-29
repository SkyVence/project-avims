import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import EditOperationPageClient from "./EditOperationPageClient"

export const metadata: Metadata = {
  title: "Edit Operation | Inventory Management System",
  description: "Edit an existing operation",
}

interface OperationPageProps {
  params: {
    operationId: string
  }
}

export default async function EditOperationPage({ params }: OperationPageProps) {
  // Get authenticated user
  const user = await getAuthenticatedUser()
  const operationId = params.operationId

  // Fetch the operation
  const operation = await prisma.operation.findUnique({
    where: {
      id: operationId,
    },
    include: {
      image: true,
      operationItems: true,
    },
  })

  if (!operation) {
    return notFound()
  }

  // Get items for selection
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

  // Get packages for selection
  const packages = await prisma.package.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      image: true,
      packageItems: {
        include: {
          item: true,
        },
      },
    },
  })

  // Format the packages to match the expected structure in the client component
  const formattedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    image: pkg.image,
    packageItems: pkg.packageItems.map(pi => ({
      itemId: pi.itemId,
      quantity: pi.quantity,
      item: {
        name: pi.item.name,
        value: pi.item.value,
      }
    }))
  }))

  // Format the operation data to match the form schema
  const formattedOperation = {
    name: operation.name,
    description: operation.description || "",
    year: operation.year || undefined,
    location: operation.location || "",
    active: operation.active,
    images: operation.image ? [{
      url: operation.image.url,
      key: operation.image.key,
    }] : [],
    operationItems: operation.operationItems.map((oi) => ({
      itemId: oi.itemId || undefined,
      packageId: oi.packageId || undefined,
      quantity: oi.quantity,
    })),
  }

  return (
    <EditOperationPageClient
      operation={formattedOperation}
      operationId={operationId}
      items={items}
      packages={formattedPackages}
    />
  )
}

