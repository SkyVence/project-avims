import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/auth-options"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        families: true,
        subfamilies: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching item:", error)
    return NextResponse.json({ error: "Error fetching item" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()
    const { name, description, brand, value, location, sku, quantity, origin, assuranceValue, dateOfPurchase, length, width, height, weight, hsCode, categoryIds, familyIds, subfamilyIds } = body

    const volume = parseFloat(length) * parseFloat(width) * parseFloat(height)

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
        brand,
        value: parseFloat(value),
        location,
        sku,
        quantity: parseInt(quantity),
        origin,
        assuranceValue: parseFloat(assuranceValue),
        dateOfPurchase: new Date(dateOfPurchase),
        length: parseFloat(length),
        width: parseFloat(width),
        height: parseFloat(height),
        volume,
        weight: parseFloat(weight),
        hsCode,
        category: {
          set: categoryIds.map((catId: string) => ({ id: catId })),
        },
        families: {
          set: familyIds.map((famId: string) => ({ id: famId })),
        },
        subfamilies: {
          set: subfamilyIds.map((subfamId: string) => ({ id: subfamId })),
        },
      },
    })

    await prisma.action.create({
      data: {
        type: 'UPDATE',
        details: `Updated item: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error("Error updating item:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Error updating item" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const deletedItem = await prisma.item.delete({
      where: { id },
    })

    await prisma.action.create({
      data: {
        type: 'DELETE',
        details: `Deleted item: ${deletedItem.name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 })
  }
}

