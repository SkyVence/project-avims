import type { Metadata } from "next"
import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { DashboardHeader } from "../../components/dashboard/dashboard-header"
import { DashboardMetrics } from "../../components/dashboard/dashboard-metrics"
import { RecentActivity } from "../../components/dashboard/recent-activity"
import { InventorySummary } from "../../components/dashboard/inventory-summary"
import { QuickActions } from "../../components/dashboard/quick-actions"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.dashboard")
  
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function Dashboard() {
  const user = await getAuthenticatedUser()
  const t = await getTranslations()
  
  // Get count of items, packages, and operations
  const [itemCount, packageCount, operationCount, categoryCount] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.package.count({ where: { userId: user.id } }),
    prisma.operation.count({ where: { userId: user.id } }),
    prisma.category.count()
  ])
  
  // Get top 5 most recent items
  const recentItems = await prisma.item.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      brand: true,
      value: true,
      createdAt: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })
  
  // Get top 5 most recent packages
  const recentPackages = await prisma.package.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          packageItems: true
        }
      }
    }
  })
  
  // Get top 5 most recent operations
  const recentOperations = await prisma.operation.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      _count: {
        select: {
          operationItems: true
        }
      }
    }
  })
  
  // Get inventory value 
  const inventoryValue = await prisma.$queryRaw`
    SELECT
      SUM("value" * "quantity") as total_value,
      COUNT(*) as item_count,
      SUM("quantity") as total_quantity
    FROM "Item"
    WHERE "userId" = ${user.id}
  `
  
  // Get top 5 most valuable categories
  const topCategories = await prisma.$queryRaw`
    SELECT
      c.id as id,
      c.name as name,
      SUM(i.value * i.quantity) as total_value,
      COUNT(i.id) as item_count
    FROM "Item" i
    JOIN "Category" c ON i."categoryId" = c.id
    WHERE i."userId" = ${user.id}
    GROUP BY c.id, c.name
    ORDER BY total_value DESC
    LIMIT 5
  `

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader 
        user={user} 
        title={t("dashboard.title")}
        welcome={t("dashboard.welcome")}
        summary={t("dashboard.description")}
      />
      
      <DashboardMetrics 
        itemCount={itemCount} 
        packageCount={packageCount} 
        operationCount={operationCount}
        categoryCount={categoryCount}
        inventoryValue={inventoryValue as any[]} 
      />
      
      <div className="grid gap-6 md:grid-cols-3">
        <RecentActivity 
          recentItems={recentItems} 
          recentPackages={recentPackages} 
          recentOperations={recentOperations}
          title={t("dashboard.recentActivity.title")}
        />
        
        <div className="md:col-span-1 space-y-6">
          <InventorySummary 
            topCategories={topCategories as any[]} 
            title={t("dashboard.inventorySummary.title")}
          />
          <QuickActions title={t("dashboard.quickActions.title")}/>
        </div>
      </div>
    </div>
  )
}

