import type React from "react"
import { getAuthenticatedUser } from "@/lib/auth"
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar"
import AppSidebar from "../../components/app-sidebar"
import AppSidebarHeader from "../../components/app-sidebar-header"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will sync the user data and redirect if not authenticated
  await getAuthenticatedUser()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppSidebarHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

