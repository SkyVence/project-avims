"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function ItemsHeader() {
  const router = useRouter()
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('items.header.title')}</h1>
        <p className="text-muted-foreground">{t('items.header.description')}</p>
      </div>
      <Button onClick={() => router.push("/items/new")}>
        <Plus className="mr-2 h-4 w-4" />
        {t('items.header.buttons.add')}
      </Button>
    </div>
  )
}

