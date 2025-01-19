import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('q')

    const items = await prisma.item.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      } : undefined,
      include: {
        category: true,
      },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, brand, value, location, sku, quantity, origin, assuranceValue, dateOfPurchase, length, width, height, weight, hsCode, categoryIds, familyIds, subfamilyIds } = body
    const volume = parseFloat(length) * parseFloat(width) * parseFloat(height)

    const newItem = await prisma.item.create({
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
        weight: parseFloat(weight),
        volume,
        hsCode,
        category: {
          connect: categoryIds.map((id: string) => ({ id })),
        },
        families: {
          connect: familyIds.map((id: string) => ({ id })),
        },
        subfamilies: {
          connect: subfamilyIds.map((id: string) => ({ id })),
        },
      },
    })

    // Create an action for the new item
    await prisma.action.create({
      data: {
        type: 'CREATE',
        details: `Created item: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error("Error creating item:", error instanceof Error ? error.message : String(error))
    console.error("Error details:", JSON.stringify(error, null, 2))
    return NextResponse.json({ error: "Error creating item", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

