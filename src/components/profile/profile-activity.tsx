import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Box, Package, Truck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type ActivityItem = {
  type: "item" | "package" | "operation"
  name: string
  createdAt: Date
}

interface ProfileActivityProps {
  activity: ActivityItem[]
}

export function ProfileActivity({ activity }: ProfileActivityProps) {
  if (activity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent activity in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">No recent activity found</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your recent activity in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {activity.map((item, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10">
                  {item.type === "item" ? (
                    <Box className="h-4 w-4 text-primary" />
                  ) : item.type === "package" ? (
                    <Package className="h-4 w-4 text-primary" />
                  ) : (
                    <Truck className="h-4 w-4 text-primary" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.type === "item"
                    ? `Added item: ${item.name}`
                    : item.type === "package"
                      ? `Created package: ${item.name}`
                      : `Started operation: ${item.name}`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

