import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { CreateUserForm } from "@/components/forms/create-user-form"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateUserForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Users List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  )
}

