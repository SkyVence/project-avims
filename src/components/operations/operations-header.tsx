import Link from "next/link"
import { Button } from "../ui/button"
import { PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"

export function OperationsHeader() {
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('operations.header.title')}</h1>
        <p className="text-muted-foreground">
          {t('operations.header.description')}
        </p>
      </div>
      <Button asChild>
        <Link href="/operations/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('operations.header.buttons.add')}
        </Link>
      </Button>
    </div>
  )
} 