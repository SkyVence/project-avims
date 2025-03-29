import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsClient } from "@/components/reports/reports-client"

export async function ReportsData() {
  // Get authenticated user
  const user = await getAuthenticatedUser()

  // Get operations growth data - all operations grouped by month
  const operationsGrowth = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count,
      SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active_count
    FROM "Operation"
    WHERE "userId" = ${user.id}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month
  `

  // Get packages growth data - all packages grouped by month
  const packagesGrowth = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "createdAt") as month,
      COUNT(*) as count,
      SUM(CASE WHEN active = true THEN 1 ELSE 0 END) as active_count
    FROM "Package" 
    WHERE "userId" = ${user.id}
    GROUP BY DATE_TRUNC('month', "createdAt")
    ORDER BY month
  `

  // Get item distribution by category
  const categoryDistribution = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          items: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Get item distribution by family
  const familyDistribution = await prisma.family.findMany({
    select: {
      id: true,
      name: true,
      category: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          items: true
        }
      }
    },
    where: {
      items: {
        some: {}
      }
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Get inventory value summary
  const inventoryValue = await prisma.$queryRaw`
    SELECT
      SUM("value" * "quantity") as total_value,
      SUM("insuranceValue" * "quantity") as total_insurance_value,
      COUNT(*) as item_count,
      SUM("quantity") as total_quantity
    FROM "Item"
    WHERE "userId" = ${user.id}
  `

  // Get top 10 most valuable items
  const topItems = await prisma.item.findMany({
    where: {
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      brand: true,
      value: true,
      insuranceValue: true,
      quantity: true,
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      value: 'desc'
    },
    take: 10
  })

  // Get value by category
  const valueByCategory = await prisma.$queryRaw`
    SELECT
      c.name as category_name,
      SUM(i.value * i.quantity) as total_value
    FROM "Item" i
    JOIN "Category" c ON i."categoryId" = c.id
    WHERE i."userId" = ${user.id}
    GROUP BY c.name
    ORDER BY total_value DESC
  `

  return (
    <div className="space-y-6">
      <ReportsHeader />
      <ReportsClient 
        operationsGrowth={operationsGrowth as any[]}
        packagesGrowth={packagesGrowth as any[]}
        categoryDistribution={categoryDistribution}
        familyDistribution={familyDistribution}
        inventoryValue={inventoryValue as any[]}
        topItems={topItems}
        valueByCategory={valueByCategory as any[]}
      />
    </div>
  )
} 