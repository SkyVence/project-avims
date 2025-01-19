import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const families = await prisma.family.findMany()
    return NextResponse.json(families)
  } catch (error) {
    console.error("Error fetching families:", error)
    return NextResponse.json({ error: "Error fetching families" }, { status: 500 })
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

    const newFamily = await prisma.family.create({
      data: {
        name,
      },
    })

    return NextResponse.json(newFamily)
  } catch (error) {
    console.error("Error creating family:", error)
    return NextResponse.json({ error: "Error creating family" }, { status: 500 })
  }
}

