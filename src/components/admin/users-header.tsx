"use client"

import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { InviteUserDialog } from "./invite-user-dialog"
import { useTranslations } from "next-intl"

export function UsersHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const t = useTranslations()

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('admin.users.header.title')}</h1>
        <p className="text-muted-foreground">{t('admin.users.header.description')}</p>
      </div>
      <Button onClick={() => setIsDialogOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        {t('admin.users.header.buttons.invite')}
      </Button>
      <InviteUserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

