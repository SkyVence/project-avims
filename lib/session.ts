import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return null
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser,
    }
  } catch (error) {
    console.error("Error fetching current user:", error)
    return null
  }
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>

