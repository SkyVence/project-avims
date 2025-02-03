import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const term = searchParams.get('term')

    if (!term) {
      return NextResponse.json({ error: "Search term is required" }, { status: 400 })
    }

    const items = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { sku: { contains: term, mode: 'insensitive' } },
          { brand: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        families: true,
        subfamilies: true,
      },
      take: 50, // Limit the number of results
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error searching items:", error)
    return NextResponse.json({ error: "Failed to search items" }, { status: 500 })
  }
}