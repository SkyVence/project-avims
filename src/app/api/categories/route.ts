import { NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Ensure user is authenticated
    await getAuthenticatedUser()

    // Fetch categories with families and sub-families
    const categories = await prisma.category.findMany({
      include: {
        families: {
          include: {
            subFamilies: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

