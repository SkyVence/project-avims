import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Users, Layers, Package, FolderTree, Archive } from "lucide-react"

export default async function AdminDashboard() {
  const userCount = await prisma.user.count()
  const categoryCount = await prisma.category.count()
  const itemCount = await prisma.item.count()
  const familyCount = await prisma.family.count()
  const subFamilyCount = await prisma.subFamily.count()

  const stats = [
    { title: "Total Users", value: userCount, icon: Users },
    { title: "Total Categories", value: categoryCount, icon: Layers },
    { title: "Total Families", value: familyCount, icon: FolderTree },
    { title: "Total Subfamilies", value: subFamilyCount, icon: Archive },
    { title: "Total Items", value: itemCount, icon: Package },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

