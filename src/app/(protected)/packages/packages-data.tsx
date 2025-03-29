import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { PackagesTable } from "@/components/packages/packages-table"
import { PackagesHeader } from "@/components/packages/packages-header"

export async function PackagesData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Get packages
  const packages = await prisma.package.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <PackagesHeader />
      <PackagesTable initialPackages={packages} />
    </div>
  )
}

