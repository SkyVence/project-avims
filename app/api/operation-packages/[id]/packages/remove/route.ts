import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { packageIds } = body

    if (!Array.isArray(packageIds) || packageIds.length === 0) {
      return NextResponse.json({ error: "Invalid package IDs" }, { status: 400 })
    }

    const updatedOperationPackage = await prisma.operationPackage.update({
      where: { id: params.id },
      data: {
        packages: {
          disconnect: packageIds.map((id) => ({ id })),
        },
      },
      include: {
        packages: true,
      },
    })

    return NextResponse.json(updatedOperationPackage)
  } catch (error) {
    console.error("Error removing packages from operation package:", error)
    return NextResponse.json({ error: "Failed to remove packages from operation package" }, { status: 500 })
  }
}

