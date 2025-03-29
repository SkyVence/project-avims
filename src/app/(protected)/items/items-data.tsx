import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ItemsTable } from "../../../components/items/items-table"
import { ItemsHeader } from "../../../components/items/items-header"

export async function ItemsData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Get items
  const items = await prisma.item.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      category: {
        select: {
          name: true
        }
      },
      family: {
        select: {
          name: true
        }
      },
      subFamily: {
        select: {
          name: true
        }
      },
    }
  })

  return (
    <div className="space-y-6">
      <ItemsHeader />
      <ItemsTable initialItems={items} />
    </div>
  )
}

