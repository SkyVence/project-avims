import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function getAuthenticatedUser() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  // Get the user from Clerk
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect("/sign-in")
  }

  // Check if user exists in our database
  let user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  })

  // If user doesn't exist or needs updating, upsert them
  if (!user || user.email !== clerkUser.emailAddresses[0]?.emailAddress || user.profileImg !== clerkUser.imageUrl) {
    user = await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        profileImg: clerkUser.imageUrl || "",
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        username: clerkUser.username || "",
        profileImg: clerkUser.imageUrl || "",
        role: UserRole.USER,
      },
    })
  }

  // If the user hasn't completed onboarding (no username set), redirect them
  if (!user.username) {
    redirect("/onboarding?newUser=true")
  }

  return user
}

export async function requireAdmin() {
  const user = await getAuthenticatedUser()

  if (user.role !== UserRole.ADMIN) {
    redirect("/")
  }

  return user
}