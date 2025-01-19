import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemIds } = await req.json()

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "Invalid item IDs" }, { status: 400 })
    }

    const deletedItems = await prisma.item.deleteMany({
      where: {
        id: {
          in: itemIds,
        },
      },
    })

    // Create an action for the bulk delete operation
    await prisma.action.create({
      data: {
        type: 'BULK_DELETE',
        details: `Deleted ${deletedItems.count} items`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: `${deletedItems.count} items deleted successfully` })
  } catch (error) {
    console.error("Error deleting items:", error)
    return NextResponse.json({ error: "Error deleting items" }, { status: 500 })
  }
}

