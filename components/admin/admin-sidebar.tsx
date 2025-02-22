"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"


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
  
    return (
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin Panel</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminRoutes.map((route) => (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={route.href}
                        className={cn(
                          pathname === route.href && "bg-muted"
                        )}
                      >
                        {route.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Main App
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
  }