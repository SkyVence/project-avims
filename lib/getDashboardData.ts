import { prisma } from "./prisma"

export async function getDashboardData() {
  const [
    itemCount,
    packageCount,
    operationPackageCount,
    totalValue,
    recentActions,
    inventoryData,
    categoryData,
    recentItems,
  ] = await Promise.all([
    prisma.item.count(),
    prisma.package.count(),
    prisma.operationPackage.count(),
    prisma.item.aggregate({ _sum: { value: true } }),
    prisma.action.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    prisma.item.groupBy({
      by: ["createdAt"],
      _count: { id: true },
      orderBy: { createdAt: "asc" },
      take: 30,
    }),
    prisma.category.findMany({
      include: {
        items: {
          select: { value: true },
        },
      },
    }),
    prisma.item.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        families: true,
        subfamilies: true,
      },
    }),
  ])

  return {
    stats: {
      totalValue: totalValue._sum.value || 0,
      itemCount,
      packageCount,
      operationPackageCount,
    },
    recentActions: recentActions.map((action) => ({
      id: action.id,
      type: action.type,
      details: action.details,
      createdAt: action.createdAt,
      user: { name: action.user.name },
    })),
    inventoryData: inventoryData.map((data) => ({
      date: data.createdAt.toISOString().split("T")[0],
      count: data._count.id,
    })),
    categoryData: categoryData.map((category) => ({
      name: category.name,
      items: category.items,
    })),
    items: recentItems.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      createdAt: item.createdAt,
      category: item.category,
      family: item.families,
      subFamily: item.subfamilies,
    })),
  }
}

