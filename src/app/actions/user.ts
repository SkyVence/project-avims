"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { requireAdmin } from "@/lib/auth"
import { auth } from "@clerk/nextjs/server"

const onboardingSchema = z.object({
  clerkId: z.string(),
  username: z.string().min(3).max(50),
  bio: z.string().max(160).optional(),
})

const profileUpdateSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().max(160).optional(),
})

export async function completeOnboarding(data: z.infer<typeof onboardingSchema>) {
  const { clerkId, username, bio } = onboardingSchema.parse(data)

  // Check if username is already taken
  const existingUser = await prisma.user.findFirst({
    where: {
      username,
      NOT: {
        clerkId,
      },
    },
  })

  if (existingUser) {
    throw new Error("Username is already taken")
  }

  // Update the user in the database
  await prisma.user.update({
    where: {
      clerkId,
    },
    data: {
      username,
      bio,
    },
  })

  revalidatePath("/")
  return { success: true }
}

export async function checkIsAdmin() {
  try {
    const isAdmin = await requireAdmin();
    if (isAdmin) {
      return true
    }
  } catch (error) {
    return false;
  }
}

export async function updateProfile(data: z.infer<typeof profileUpdateSchema>) {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("Not authenticated")
  }

  // Validate the data
  const validatedData = profileUpdateSchema.parse(data)

  // Update the user in the database
  const updatedUser = await prisma.user.update({
    where: {
      clerkId: userId,
    },
    data: {
      username: validatedData.username,
      bio: validatedData.bio,
    },
  })

  revalidatePath("/profile")
  revalidatePath("/settings")
  return { success: true }
}