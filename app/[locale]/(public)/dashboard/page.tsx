import { DashboardSkeleton } from "@/components/DashboardUI/dashboardSkeleton";
import DashboardUi from "@/components/DashboardUI/dashboardUi";
import { getDashboardData } from "@/lib/getDashboardData"
import { Suspense } from "react";

export default async function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  const dashboardData = await getDashboardData()

  return (
    <DashboardUi
      categoryData={dashboardData.categoryData}
      stats={dashboardData.stats}
      recentActions={dashboardData.recentActions}
      inventoryData={dashboardData.inventoryData}
      items={dashboardData.items}
    />
  )
}
