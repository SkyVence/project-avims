'use client'

import * as React from 'react'
import { Link } from '@/i18n/routing'
import { useRouter, usePathname } from '@/i18n/routing'
import { LayoutDashboard, Package, Boxes, Settings, LogOut, User, Moon, Sun, Plus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from "@/lib/utils"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTranslations } from 'next-intl'
import { signOut, useSession } from 'next-auth/react'


export function SidebarUI() {
  const t = useTranslations('sidebar')
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  // If we're on the login page, don't render the sidebar
  if (pathname === '/login') {
    return null
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }
  const sidebarItems = [
    {
      title: t('main-title'),
      items: [
        { title: t('items-dashboard'), href: '/dashboard', icon: LayoutDashboard },
        { title: t('items-items'), href: '/items', icon: Package },
        { title: t('items-packages'), href: '/packages', icon: Boxes },
        { title: t('items-packagesOperation'), href: '/operation-packages', icon: Boxes },
      ],
    },
    {
      title: t('create-title'),
      items: [
        { title: t('items-createItems'), href: '/create/item', icon: Plus },
        { title: t('items-createPackage'), href: '/create/package', icon: Plus },
        { title: t('items-createPackageOperation'), href: '/create/operation-package', icon: Plus },
      ],
    },
  ]
  // Si on est sur la page de connexion, on ne rend pas la barre latérale
  if (pathname === '/login') {
    return null
  }

  return (
    <Sidebar variant='floating' collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">{t('header-title')}</span>
                <span className="text-xs text-muted-foreground">{t('header-version')}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {sidebarItems.map((section, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          pathname === item.href && "bg-muted"
                        )}
                      >
                        <item.icon className="mr-2 size-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="mr-2 size-4" />
                  <span className="flex-grow text-left">
                    {session?.user?.name || 'Utilisateur'}
                  </span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 size-4" />
                    <span>{t('footer-settings')}</span>
                  </Link>
                </DropdownMenuItem>
                {session?.user?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center">
                      <User className="mr-2 size-4" />
                      <span>{t('footer-adminDashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                  {theme === 'dark' ? (
                    <Sun className="mr-2 size-4" />
                  ) : (
                    <Moon className="mr-2 size-4" />
                  )}
                  <span>{t('footer-changeTheme')}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  <span>{t('footer-logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}