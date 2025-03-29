import { requireAdmin } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UsersTable } from "../../../../components/admin/users-table"
import { UsersHeader } from "../../../../components/admin/users-header"

export async function UsersData() {
  // Ensure the user is an admin
  await requireAdmin()

  // Get all users
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <UsersHeader />
      <UsersTable initialUsers={users} />
    </div>
  )
}

