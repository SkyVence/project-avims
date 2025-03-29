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
import { useTranslations } from "next-intl"

export function AdminSidebar() {
  const pathname = usePathname()
  const t = useTranslations()

  const navItems = [
    {
      title: t('admin.sidebar.items.dashboard'),
      icon: LayoutDashboard,
      url: "/admin",
    },
    {
      title: t('admin.sidebar.items.users'),
      icon: Users,
      url: "/admin/users",
    },
    {
      title: t('admin.sidebar.items.categories'),
      icon: Tag,
      url: "/admin/categories",
    },
    {
      title: t('admin.sidebar.items.settings'),
      icon: Settings,
      url: "/admin/settings",
    },
    {
      title: t('admin.sidebar.items.backToApp'),
      icon: Package,
      url: "/",
    },
  ]

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
                  <span className="font-semibold">{t('admin.sidebar.title')}</span>
                  <span className="text-xs text-muted-foreground">{t('admin.sidebar.subtitle')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('admin.sidebar.navigation')}</SidebarGroupLabel>
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

