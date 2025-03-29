import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CategoriesManager } from "../../../../components/admin/categories-manager"

export async function CategoriesData() {
  // Ensure the user is an admin
  await requireAdmin()

  // Get all categories with families and sub-families
  const categories = await prisma.category.findMany({
    include: {
      families: {
        include: {
          subFamilies: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage categories, families, and sub-families</p>
      </div>
      <CategoriesManager initialCategories={categories} />
    </div>
  )
}

