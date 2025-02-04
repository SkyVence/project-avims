import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { calculatePackageTotalValue } from "@/lib/package-utils"

export async function POST(request: Request, { params }: { params: { id: string } }) {
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

    await prisma.package.update({
      where: { id: params.id },
      data: {
        items: {
          disconnect: itemIds.map((id) => ({ id })),
        },
      },
    })

    const newTotalValue = await calculatePackageTotalValue(params.id)

    const updatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: {
        totalValue: newTotalValue,
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error("Error removing items from package:", error)
    return NextResponse.json({ error: "Failed to remove items from package" }, { status: 500 })
  }
}

