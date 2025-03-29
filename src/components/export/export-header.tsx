"use client"

import Link from "next/link"
import { Button } from "../ui/button"
import { FileUp, Package, PackageCheck } from "lucide-react"
import { useTranslations } from "next-intl"

export function ExportHeader() {
  const t = useTranslations()
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('export.header.title')}</h1>
        <p className="text-muted-foreground">
          {t('export.header.description')}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href="/packages">
            <Package className="mr-2 h-4 w-4" />
            {t('export.header.buttons.viewPackages')}
          </Link>
        </Button>
        <Button asChild>
          <Link href="/operations">
            <PackageCheck className="mr-2 h-4 w-4" />
            {t('export.header.buttons.viewOperations')}
          </Link>
        </Button>
      </div>
    </div>
  )
} 