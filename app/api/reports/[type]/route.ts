import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { type: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    switch (params.type) {
      case "inventory":
        return await generateInventoryReport()
      case "value":
        return await generateValueReport()
      case "category":
        return await generateCategoryReport()
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json({ error: "Error generating report" }, { status: 500 })
  }
}

async function generateInventoryReport() {
  const totalItems = await prisma.item.count()
  const totalPackages = await prisma.package.count()
  const totalOperationPackages = await prisma.operationPackage.count()

  const report = {
    totalItems,
    totalPackages,
    totalOperationPackages,
  }

  return NextResponse.json(report)
}

async function generateValueReport() {
  const totalValue = await prisma.item.aggregate({
    _sum: {
      value: true,
    },
  })

  const valueByCategory = await prisma.category.findMany({
    include: {
      items: {
        select: {
          value: true,
        },
      },
    },
  })

  const report = {
    totalValue: totalValue._sum.value || 0,
    valueByCategory: valueByCategory.map(category => ({
      category: category.name,
      value: category.items.reduce((sum, item) => sum + item.value, 0),
    })),
  }

  return NextResponse.json(report)
}

async function generateCategoryReport() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { items: true },
      },
    },
  })

  const report = categories.map(category => ({
    category: category.name,
    itemCount: category._count.items,
  }))

  return NextResponse.json(report)
}

