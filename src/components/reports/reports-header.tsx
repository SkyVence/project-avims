import Link from "next/link"
import { Button } from "../ui/button"
import { BarChart3, Download } from "lucide-react"
import { useTranslations } from "next-intl"

export function ReportsHeader() {
  const t = useTranslations('reports.header')
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/export">
            <Download className="mr-2 h-4 w-4" />
            {t('exportButton')}
          </Link>
        </Button>
      </div>
    </div>
  )
} 