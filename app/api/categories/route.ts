import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name } = body

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    })

    return NextResponse.json(newCategory)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Error creating category" }, { status: 500 })
  }
}

