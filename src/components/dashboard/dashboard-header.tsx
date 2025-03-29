import { LayoutDashboard } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useTranslations } from 'next-intl'

interface DashboardHeaderProps {
  user: {
    username?: string | null
    email: string
  }
  title: string
  welcome: string
  summary: string
}

export function DashboardHeader({ user, title, welcome, summary }: DashboardHeaderProps) {
  const t = useTranslations()
  
  const timeOfDay = () => {
    const hours = new Date().getHours()
    if (hours < 12) return t("dashboard.timeOfDay.morning")
    if (hours < 18) return t("dashboard.timeOfDay.afternoon")
    return t("dashboard.timeOfDay.evening")
  }
  
  return (
    <div>
      <div className="flex items-center">
        <LayoutDashboard className="mr-2 h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <p className="text-muted-foreground mt-1">
        {welcome} {user.username || user.email.split('@')[0]}. {summary}
      </p>
    </div>
  )
} 