import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ImportHeader } from "../../../components/import/import-header"
import { ImportClient } from "../../../components/import/import-client"

export async function ImportData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Fetch categories, families, and subfamilies for dropdown options
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      families: {
        include: {
          subFamilies: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <ImportHeader />
      <ImportClient categories={categories} />
    </div>
  )
} 