import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const packages = await prisma.package.findMany({
      include: {
        items: {
          select: {
            id: true,
            name: true,
            sku: true,
            value: true,
          },
        },
      },
    })

    return NextResponse.json(packages)
  } catch (error) {
    console.error("Error fetching packages:", error)
    return NextResponse.json({ error: "Error fetching packages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const session = await getServerSession(authOptions)
    if (!session || !session.user || typeof session.user.id !== 'string') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, itemIds } = body

    const newPackage = await prisma.package.create({
      data: {
        name,
        location,
        totalValue: 0, // Initialize with 0, we'll update it later
        items: {
          connect: itemIds.map((id: string) => ({ id })),
        },
      },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            sku: true,
            value: true,
          },
        },
      },
    })

    // Calculate total value
    const totalValue = newPackage.items.reduce((sum, item) => sum + item.value, 0)

    // Update package with total value
    const updatedPackage = await prisma.package.update({
      where: { id: newPackage.id },
      data: { totalValue },
    })

    // Create an action for the new package
    await prisma.action.create({
      data: {
        type: 'CREATE',
        details: `Created package: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedPackage)
  } catch (error) {
    console.error("Error creating package:", error)
    return NextResponse.json({ error: "Error creating package" }, { status: 500 })
  }
}

