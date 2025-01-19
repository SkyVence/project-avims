import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const subfamilies = await prisma.subFamily.findMany()
    return NextResponse.json(subfamilies)
  } catch (error) {
    console.error("Error fetching subfamilies:", error)
    return NextResponse.json({ error: "Error fetching subfamilies" }, { status: 500 })
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

    const newSubFamily = await prisma.subFamily.create({
      data: {
        name,
      },
    })

    return NextResponse.json(newSubFamily)
  } catch (error) {
    console.error("Error creating subfamily:", error)
    return NextResponse.json({ error: "Error creating subfamily" }, { status: 500 })
  }
}

