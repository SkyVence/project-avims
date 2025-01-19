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

    const operationPackages = await prisma.operationPackage.findMany({
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

    return NextResponse.json(operationPackages)
  } catch (error) {
    console.error("Error fetching operation packages:", error)
    return NextResponse.json({ error: "Error fetching operation packages" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, location, year, itemIds, packageIds } = body

    const newOperationPackage = await prisma.operationPackage.create({
      data: {
        name,
        location,
        year,
        items: {
          connect: itemIds.map((id: string) => ({ id })),
        },
        packages: {
          connect: packageIds.map((id: string) => ({ id })),
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

    // Create an action for the new operation package
    await prisma.action.create({
      data: {
        type: 'CREATE',
        details: `Created operation package: ${name}`,
        userId: session.user.id,
      },
    })

    return NextResponse.json(newOperationPackage)
  } catch (error) {
    console.error("Error creating operation package:", error)
    return NextResponse.json({ error: "Error creating operation package" }, { status: 500 })
  }
}

// PUT route for updating an operation package
export async function PUT(req: Request) {
  const body = await req.json()
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, name, location, year, itemIds, packageIds } = body

    const updatedOperationPackage = await prisma.operationPackage.update({
      where: { id },
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

// DELETE route for deleting an operation package
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Operation package ID is required" }, { status: 400 })
    }

    const deletedOperationPackage = await prisma.operationPackage.delete({
      where: { id },
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

