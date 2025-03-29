"use client"

import { useAuth, useUser } from "@clerk/nextjs"
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import { User, Settings, Sun, Moon, LogOut, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import { checkIsAdmin } from "../app/actions/user"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

export default function AppSidebarFooter() {
  const { isSignedIn, signOut } = useAuth()
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    async function checkAdminStatus() {
      if (isSignedIn) {
        const adminStatus = await checkIsAdmin()
        setIsAdmin(adminStatus ?? false)
      }
    }
    
    checkAdminStatus()
  }, [isSignedIn])

  if (!isSignedIn) {
    return (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link href="/sign-in" className="items-center justify-center">
              {t('sidebar.footer.signIn')}
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
    )
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="justify-start gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || t('navigation.profile')} />
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                    {user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{user?.username}</span>
                  <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" side="top">
              <DropdownMenuLabel>{t('sidebar.footer.myAccount')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('sidebar.footer.profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('sidebar.footer.settings')}</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      <span>{t('sidebar.footer.adminDashboard')}</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
                  <span>{t('sidebar.footer.changeTheme')}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="text-destructive focus:text-destructive-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('sidebar.footer.logOut')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

