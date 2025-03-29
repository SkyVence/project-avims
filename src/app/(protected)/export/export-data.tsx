import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ExportHeader } from "../../../components/export/export-header"
import { ExportClient } from "../../../components/export/export-client"

export async function ExportData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Fetch operations
  const operations = await prisma.operation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      year: true,
      active: true,
      _count: {
        select: {
          operationItems: true,
        },
      },
    },
  })

  // Fetch packages
  const packages = await prisma.package.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      year: true,
      active: true,
      _count: {
        select: {
          packageItems: true,
        },
      },
    },
  })

  return (
    <div className="space-y-6">
      <ExportHeader />
      <ExportClient operations={operations} packages={packages} />
    </div>
  )
} 