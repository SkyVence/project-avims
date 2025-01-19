import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const items = await prisma.item.findMany({
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    const growthData = items.reduce((acc, item) => {
      const date = new Date(item.createdAt).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date]++
      return acc
    }, {} as Record<string, number>)

    const data = Object.entries(growthData).map(([date], index, array) => ({
      date,
      count: array.slice(0, index + 1).reduce((sum, [, c]) => sum + c, 0),
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching inventory growth data:", error)
    return NextResponse.json({ error: "Error fetching inventory growth data" }, { status: 500 })
  }
}

