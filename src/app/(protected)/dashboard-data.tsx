import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Overview } from "../../components/dashboard/overview"
import { RecentActivity } from "../../components/dashboard/recent-activity"

export async function DashboardData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Get counts
  const itemCount = await prisma.item.count({
    where: {
      userId: user.id,
    },
  })

  const packageCount = await prisma.package.count({
    where: {
      userId: user.id,
    },
  })

  const activeOperationCount = await prisma.operation.count({
    where: {
      userId: user.id,
      active: true,
    },
  })

  // Get recent activity
  const recentItems = await prisma.item.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })

  const recentPackages = await prisma.package.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })

  const recentOperations = await prisma.operation.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })

  // Combine and sort recent activity
  const recentActivity = [
    ...recentItems.map((item) => ({
      type: "item" as const,
      name: item.name,
      createdAt: item.createdAt,
    })),
    ...recentPackages.map((pkg) => ({
      type: "package" as const,
      name: pkg.name,
      createdAt: pkg.createdAt,
    })),
    ...recentOperations.map((op) => ({
      type: "operation" as const,
      name: op.name,
      createdAt: op.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your inventory management system</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemCount}</div>
            <p className="text-xs text-muted-foreground">Items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{packageCount}</div>
            <p className="text-xs text-muted-foreground">Packages created</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOperationCount}</div>
            <p className="text-xs text-muted-foreground">Operations in progress</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Inventory overview for the current month (Work in Progress)</CardDescription>
          </CardHeader>
          <CardContent>
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recent activity in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity activity={recentActivity} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

