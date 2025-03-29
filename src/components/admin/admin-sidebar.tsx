"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"
import { GalleryVerticalEnd, LayoutDashboard, Package, Settings, Tag, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AppSidebarFooter from "../app-sidebar-footer"

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/admin",
  },
  {
    title: "Users",
    icon: Users,
    url: "/admin/users",
  },
  {
    title: "Categories",
    icon: Tag,
    url: "/admin/categories",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/admin/settings",
  },
  {
    title: "Back to App",
    icon: Package,
    url: "/",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Admin</span>
                  <span className="text-xs text-muted-foreground">Inventory System</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  )
}

