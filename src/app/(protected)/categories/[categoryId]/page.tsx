import type { Metadata } from "next"
import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { CategoryDetail } from "../../../../components/categories/category-detail"

interface CategoryPageProps {
  params: {
    categoryId: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { id: params.categoryId },
  })

  if (!category) {
    return {
      title: "Category Not Found | Inventory Management System",
    }
  }

  return {
    title: `${category.name} | Categories | Inventory Management System`,
    description: `Browse ${category.name} category details`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Get authenticated user
  await getAuthenticatedUser()

  // Get category with families and sub-families
  const category = await prisma.category.findUnique({
    where: { id: params.categoryId },
    include: {
      families: {
        include: {
          subFamilies: true,
        },
      },
    },
  })

  if (!category) {
    notFound()
  }

  // Get items in this category
  const items = await prisma.item.findMany({
    where: { categoryId: params.categoryId },
    take: 10,
    orderBy: { createdAt: "desc" },
  })

  return <CategoryDetail category={category} items={items} />
}

