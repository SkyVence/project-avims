"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function PackagesHeader() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('packages.header.title')}</h1>
        <p className="text-muted-foreground">{t('packages.header.description')}</p>
      </div>
      <Button onClick={() => router.push("/packages/new")}>
        <Plus className="mr-2 h-4 w-4" />
        {t('packages.header.buttons.add')}
      </Button>
    </div>
  )
}

