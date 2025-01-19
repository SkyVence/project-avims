import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const operationPackage = await prisma.operationPackage.findUnique({
      where: { id: params.id },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            totalValue: true,
          },
        },
      },
    })

    if (!operationPackage) {
      return NextResponse.json({ error: "Operation package not found" }, { status: 404 })
    }

    return NextResponse.json(operationPackage)
  } catch (error) {
    console.error("Error fetching operation package:", error)
    return NextResponse.json({ error: "Error fetching operation package" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json()
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, year, itemIds, packageIds } = body

    const updatedOperationPackage = await prisma.operationPackage.update({
      where: { id: params.id },
      data: {
        name,
        location,
        year,
        items: {
          set: itemIds.map((id: string) => ({ id })),
        },
        packages: {
          set: packageIds.map((id: string) => ({ id })),
        },
      },
      include: {
        items: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        packages: {
          select: {
            id: true,
            name: true,
            totalValue: true,
          },
        },
      },
    })

    // Create an action for the updated operation package
    await prisma.action.create({
      data: {
        type: 'UPDATE',
        details: `Updated operation package: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedOperationPackage)
  } catch (error) {
    console.error("Error updating operation package:", error)
    return NextResponse.json({ error: "Error updating operation package" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deletedOperationPackage = await prisma.operationPackage.delete({
      where: { id: params.id },
    })

    // Create an action for the deleted operation package
    await prisma.action.create({
      data: {
        type: 'DELETE',
        details: `Deleted operation package: ${deletedOperationPackage.name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Operation package deleted successfully" })
  } catch (error) {
    console.error("Error deleting operation package:", error)
    return NextResponse.json({ error: "Error deleting operation package" }, { status: 500 })
  }
}

