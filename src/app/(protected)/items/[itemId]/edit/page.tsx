import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import EditItemPageClient from "./EditItemPageClient"

export const metadata: Metadata = {
  title: "Edit Item | Inventory Management System",
  description: "Edit an existing inventory item",
}

interface ItemPageProps {
  params: {
    itemId: string
  }
}

export default async function EditItemPage({ params }: ItemPageProps) {
  // Get authenticated user
  const user = await getAuthenticatedUser()
  const { itemId } = params

  // Fetch the item
  const item = await prisma.item.findUnique({
    where: {
      id: itemId,
    },
    include: {
      image: true,
    },
  })

  if (!item) {
    return notFound()
  }

  // Get categories, families, and subfamilies
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const families = await prisma.family.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const subFamilies = await prisma.subFamily.findMany({
    orderBy: {
      name: "asc",
    },
  })

  // Format the item data to match the form schema
  const formattedItem = {
    name: item.name,
    description: item.description || "",
    brand: item.brand || "",
    value: item.value || undefined,
    insuranceValue: item.insuranceValue || undefined,
    hsCode: item.hsCode || "",
    location: item.location || "",
    length: item.length || undefined,
    width: item.width || undefined,
    height: item.height || undefined,
    weight: item.weight || undefined,
    categoryId: item.categoryId || undefined,
    familyId: item.familyId || undefined,
    subFamilyId: item.subFamilyId || undefined,
    quantity: item.quantity || 1,
    // Handle single image instead of mapping multiple images
    images: item.image ? [{ url: item.image.url, key: item.image.key }] : [],
  }

  return (
    <EditItemPageClient
      item={formattedItem}
      itemId={itemId}
      categories={categories}
      families={families}
      subFamilies={subFamilies}
    />
  )
}

