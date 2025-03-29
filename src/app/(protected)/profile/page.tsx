import type { Metadata } from "next"
import { getAuthenticatedUser } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileStats } from "@/components/profile/profile-stats"
import { Edit, Settings } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"

export const metadata: Metadata = {
  title: "Profile | Inventory Management System",
  description: "View and manage your profile",
}

export default async function ProfilePage() {
  const user = await getAuthenticatedUser()

  // Get user stats
  const itemCount = await prisma.item.count({
    where: { userId: user.id },
  })

  const packageCount = await prisma.package.count({
    where: { userId: user.id },
  })

  const operationCount = await prisma.operation.count({
    where: { userId: user.id },
  })

  // Get recent activity
  const recentItems = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const recentPackages = await prisma.package.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  })

  const recentOperations = await prisma.operation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
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
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/settings?tab=profile">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImg || undefined} alt={user.username || "User"} />
                <AvatarFallback>{user.username?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h2 className="text-xl font-bold">{user.username || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Role:</span>
                <span className="text-sm">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Member since:</span>
                <span className="text-sm">{formatDistanceToNow(user.createdAt, { addSuffix: true })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="activity" className="space-y-4">
              <ProfileActivity activity={recentActivity} />
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <ProfileStats itemCount={itemCount} packageCount={packageCount} operationCount={operationCount} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

