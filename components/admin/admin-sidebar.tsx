"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ArrowLeft, Menu } from "lucide-react"

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Categories",
    href: "/admin/categories",
  },
  {
    title: "Families",
    href: "/admin/families",
  },
  {
    title: "Subfamilies",
    href: "/admin/subfamilies",
  },
  {
    title: "Users",
    href: "/admin/users",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
                <div className="space-y-1">
                  <ScrollArea className="h-[calc(100vh-8rem)] px-1">
                    {adminRoutes.map((route) => (
                      <Button
                        key={route.href}
                        variant={pathname === route.href ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        asChild
                        onClick={() => setOpen(false)}
                      >
                        <Link href={route.href}>{route.title}</Link>
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
              </div>
            </div>
            <div className="mt-auto p-4">
              <Button variant="outline" className="w-full justify-start" asChild onClick={() => setOpen(false)}>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Main App
                </Link>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden md:flex flex-col justify-between h-screen pb-12 w-64", "border-r border-border")}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Admin Panel</h2>
            <div className="space-y-1">
              <ScrollArea className="h-[calc(100vh-8rem)] px-1">
                {adminRoutes.map((route) => (
                  <Button
                    key={route.href}
                    variant={pathname === route.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={route.href}>{route.title}</Link>
                  </Button>
                ))}
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main App
            </Link>
          </Button>
        </div>
      </div>
    </>
  )
}

