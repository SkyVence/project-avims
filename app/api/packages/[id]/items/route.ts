import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { itemIds } = body

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "Invalid item IDs" }, { status: 400 })
    }

    const updatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: {
        items: {
          connect: itemIds.map(id => ({ id })),
        },
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error("Error adding items to package:", error)
    return NextResponse.json({ error: "Failed to add items to package" }, { status: 500 })
  }
}