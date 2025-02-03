import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { prisma } from "@/lib/prisma"
import * as z from "zod"

const userSettingsSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, email } = userSettingsSchema.parse(body)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, email },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating user settings:", error)
    return NextResponse.json({ error: "Error updating user settings" }, { status: 500 })
  }
}

