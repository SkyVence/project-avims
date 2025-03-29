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
} from "./ui/sidebar"
import {
  BarChart3,
  Box,
  FileBox,
  FileDown,
  FileUp,
  FolderCog,
  GalleryVerticalEnd,
  LayoutDashboard,
  Package,
  PackageCheck,
  PackageOpen,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import AppSidebarFooter from "./app-sidebar-footer"
import { useTranslations } from "next-intl"

export default function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations()

  const navItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      url: "/",
    },
    {
      title: t('navigation.items'),
      icon: Package,
      url: "/items",
    },
    {
      title: t('navigation.packages'),
      icon: PackageOpen,
      url: "/packages",
    },
    {
      title: t('navigation.operations'),
      icon: PackageCheck,
      url: "/operations",
    },
    {
      title: t('navigation.categories'),
      icon: Tag,
      url: "/categories",
    },
    {
      title: t('navigation.reports'),
      icon: BarChart3,
      url: "/reports",
    },
  ]

  const navItemsInEx = [
    {
      title: t('sidebar.items.importItems'),
      icon: FileDown,
      url: "/import",
      disabled: false,
    },
    {
      title: t('sidebar.items.exportData'),
      icon: FileUp,
      url: "/export",
      disabled: false,
    },
    {
      title: t('sidebar.items.settings'),
      icon: FolderCog,
      url: "/inex-settings",
      disabled: true,
    },
  ]

  const navItemsCreate = [
    {
      title: t('sidebar.items.createItem'),
      icon: Box,
      url: "/items/new",
    },
    {
      title: t('sidebar.items.createPackage'),
      icon: PackageOpen,
      url: "/packages/new",
    },
    {
      title: t('sidebar.items.createOperation'),
      icon: FileBox,
      url: "/operations/new",
    },
  ]

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">{t('sidebar.appTitle.main')}</span>
                  <span className="text-xs text-muted-foreground">{t('sidebar.appTitle.subtitle')}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.mainNavigation')}</SidebarGroupLabel>
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
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.importExport')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsInEx.map((itemInEx) => (
                <SidebarMenuItem key={itemInEx.title}>
                  <SidebarMenuButton 
                    asChild={!itemInEx.disabled} 
                    isActive={pathname === itemInEx.url}
                    disabled={itemInEx.disabled}
                  >
                    {itemInEx.disabled ? (
                      <div className="flex items-center gap-2 cursor-not-allowed opacity-50">
                        <itemInEx.icon className="size-4" />
                        <span>{itemInEx.title}</span>
                      </div>
                    ) : (
                      <Link href={itemInEx.url}>
                        <itemInEx.icon className="size-4" />
                        <span>{itemInEx.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t('sidebar.createSection')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemsCreate.map((itemCreate) => (
                <SidebarMenuItem key={itemCreate.title}>
                  <SidebarMenuButton asChild isActive={pathname === itemCreate.url}>
                    <Link href={itemCreate.url}>
                      <itemCreate.icon className="size-4" />
                      <span>{itemCreate.title}</span>
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

