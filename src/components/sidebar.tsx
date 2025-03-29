"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Package, Box, Truck, LayoutDashboard, Settings, Menu, X } from "lucide-react"
import { useState } from "react"
import { useMobile } from "@/hooks/use-mobile"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Items",
      href: "/items",
      icon: <Box className="h-5 w-5" />,
    },
    {
      title: "Packages",
      href: "/packages",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Operations",
      href: "/operations",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const sidebarContent = (
    <>
      <div className="flex h-14 items-center px-4 border-b">
        <Link href="/" className="flex items-center font-semibold">
          <Package className="h-6 w-6 mr-2" />
          <span>Inventory System</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" className="ml-auto" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 py-2">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={isMobile ? toggleSidebar : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </>
  )

  return (
    <>
      {isMobile && (
        <Button variant="ghost" size="icon" className="fixed top-3 left-3 z-50" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {isMobile ? (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full",
            className,
          )}
        >
          {sidebarContent}
        </div>
      ) : (
        <div className={cn("w-64 border-r bg-background h-full", className)}>{sidebarContent}</div>
      )}
    </>
  )
}

