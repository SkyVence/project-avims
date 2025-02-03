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
        items: true,
        packages: true,
      },
    })

    return NextResponse.json(operationPackages)
  } catch (error) {
    console.error("Error fetching operation packages:", error)
    return NextResponse.json({ error: "Error fetching operation packages" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, location, year } = body

    const newOperationPackage = await prisma.operationPackage.create({
      data: {
        name,
        location,
        year,
      },
    })

    return NextResponse.json(newOperationPackage)
  } catch (error) {
    console.error("Error creating operation package:", error)
    return NextResponse.json({ error: "Error creating operation package" }, { status: 500 })
  }
}

