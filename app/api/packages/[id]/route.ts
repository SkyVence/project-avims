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

    const package_ = await prisma.package.findUnique({
      where: { id: params.id },
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

    if (!package_) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    return NextResponse.json(package_)
  } catch (error) {
    console.error("Error fetching package:", error)
    return NextResponse.json({ error: "Error fetching package" }, { status: 500 })
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

    const { name, location, itemIds } = body

    const updatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: {
        name,
        location,
        items: {
          set: itemIds.map((id: string) => ({ id })),
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
    const totalValue = updatedPackage.items.reduce((sum, item) => sum + item.value, 0)

    // Update package with total value
    const finalUpdatedPackage = await prisma.package.update({
      where: { id: params.id },
      data: { totalValue },
    })

    // Create an action for the updated package
    await prisma.action.create({
      data: {
        type: 'UPDATE',
        details: `Updated package: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(finalUpdatedPackage)
  } catch (error) {
    console.error("Error updating package:", error)
    return NextResponse.json({ error: "Error updating package" }, { status: 500 })
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

    const deletedPackage = await prisma.package.delete({
      where: { id: params.id },
    })

    // Create an action for the deleted package
    await prisma.action.create({
      data: {
        type: 'DELETE',
        details: `Deleted package: ${deletedPackage.name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: "Package deleted successfully" })
  } catch (error) {
    console.error("Error deleting package:", error)
    return NextResponse.json({ error: "Error deleting package" }, { status: 500 })
  }
}

