import type React from "react"
import { requireAdmin } from "@/lib/auth"
import { SidebarProvider, SidebarInset } from "../../components/ui/sidebar"
import { AdminSidebar } from "../../components/admin/admin-sidebar"
import AppSidebarHeader from "../../components/app-sidebar-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // This will sync the user data, redirect if not authenticated, and check for admin role
  await requireAdmin()

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AppSidebarHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

