"use client"

import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./mode-toggle"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { useTranslations } from "next-intl"

export function Header() {
  const t = useTranslations()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="hidden md:flex md:flex-1 md:items-center md:gap-4">
        <form className="flex-1 md:max-w-sm lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('header.search.placeholder')}
              aria-label={t('header.search.label')}
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <ModeToggle />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}

