import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Box, Package, Truck } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"

type ActivityItem = {
  type: "item" | "package" | "operation"
  name: string
  createdAt: Date
}

interface ProfileActivityProps {
  activity: ActivityItem[]
}

export function ProfileActivity({ activity }: ProfileActivityProps) {
  const t = useTranslations()

  if (activity.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.activity.title')}</CardTitle>
          <CardDescription>{t('profile.activity.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">{t('profile.activity.noActivity')}</div>
        </CardContent>
      </Card>
    )
  }

  // Helper function to format relative time with translations
  const formatRelativeTime = (date: Date) => {
    const distanceString = formatDistanceToNow(date, { addSuffix: false })
    
    if (distanceString.includes('less than a minute')) {
      return t('profile.activity.timestamp.now')
    }
    
    if (distanceString.includes('minute') || distanceString.includes('minutes')) {
      const minutes = parseInt(distanceString.split(' ')[0], 10) || 1
      return t('profile.activity.timestamp.minutes', { minutes })
    }
    
    if (distanceString.includes('hour') || distanceString.includes('hours')) {
      const hours = parseInt(distanceString.split(' ')[0], 10) || 1
      return t('profile.activity.timestamp.hours', { hours })
    }

    if (distanceString.includes('day') || distanceString.includes('days')) {
      const days = parseInt(distanceString.split(' ')[0], 10) || 1
      return t('profile.activity.timestamp.days', { days })
    }

    return distanceString
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.activity.title')}</CardTitle>
        <CardDescription>{t('profile.activity.description')}</CardDescription>
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
                    ? t('profile.activity.actions.created') + ': ' + item.name
                    : item.type === "package"
                      ? t('profile.activity.actions.created') + ': ' + item.name
                      : t('profile.activity.actions.created') + ': ' + item.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatRelativeTime(item.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

