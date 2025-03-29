import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { OperationsTable } from "../../../components/operations/operations-table"
import { OperationsHeader } from "../../../components/operations/operations-header"

export async function OperationsData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Get operations with detailed counts
  const operations = await prisma.operation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      _count: {
        select: {
          operationItems: true,
        },
      },
      operationItems: {
        select: {
          itemId: true,
          packageId: true,
        },
      },
    },
  })

  // Calculate item and package counts for each operation
  const operationsWithCounts = operations.map(operation => {
    const itemCount = operation.operationItems.filter(item => item.itemId !== null).length
    const packageCount = operation.operationItems.filter(item => item.packageId !== null).length
    
    return {
      ...operation,
      _counts: {
        items: itemCount,
        packages: packageCount,
        total: operation._count.operationItems
      }
    }
  })

  return (
    <div className="space-y-6">
      <OperationsHeader />
      <OperationsTable initialOperations={operationsWithCounts} />
    </div>
  )
}

