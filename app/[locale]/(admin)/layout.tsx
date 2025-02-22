import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import type React from "react" // Import React
import { SidebarProvider } from "@/components/ui/sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
        redirect("/")
    }

    return (
        <SidebarProvider>
            <div className="flex min-h-screen ">
                <AdminSidebar />
                <div className="flex-1 p-8 pt-6">{children}</div>
            </div>
        </SidebarProvider>
    )
}

