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

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { items: true }
        }
      }
    })

    const data = categories.map(category => ({
      category: category.name,
      count: category._count.items
    }))

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching inventory overview:", error)
    return NextResponse.json({ error: "Error fetching inventory overview" }, { status: 500 })
  }
}

