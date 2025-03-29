import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { prisma } from "@/lib/db"

export const metadata: Metadata = {
  title: "Admin Dashboard | Inventory Management System",
  description: "Admin dashboard for the inventory management system",
}

export default async function AdminDashboardPage() {
  // Get counts
  const userCount = await prisma.user.count()
  const categoryCount = await prisma.category.count()
  const familyCount = await prisma.family.count()
  const subFamilyCount = await prisma.subFamily.count()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, categories, families, and sub-families</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryCount}</div>
            <p className="text-xs text-muted-foreground">Item categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyCount}</div>
            <p className="text-xs text-muted-foreground">Item families</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sub-Families</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subFamilyCount}</div>
            <p className="text-xs text-muted-foreground">Item sub-families</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

