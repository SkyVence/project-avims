import Link from "next/link"
import { Button } from "../ui/button"
import { FileDown, Upload } from "lucide-react"
import { useTranslations } from "next-intl"

export function ImportHeader() {
  const t = useTranslations()
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('import.title')}</h1>
        <p className="text-muted-foreground">
          {t('import.description')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/import/template">
            <FileDown className="mr-2 h-4 w-4" />
            {t('import.buttons.downloadTemplate')}
          </Link>
        </Button>
        <Button asChild>
          <Link href="/items">
            <Upload className="mr-2 h-4 w-4" />
            {t('import.buttons.viewItems')}
          </Link>
        </Button>
      </div>
    </div>
  )
} 