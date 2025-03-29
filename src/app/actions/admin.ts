"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import { createClerkClient } from '@clerk/backend'
import type { UserRole } from "@prisma/client"

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
// Invite a new user
export async function inviteUser(email: string) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    console.log(`${process.env.NEXT_PUBLIC_CLERK_INVITE_REDIRECT}?newUser=true`)
    // Create the invitation in Clerk
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_CLERK_INVITE_REDIRECT}?newUser=true`,
    })
    
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error inviting user:", error)
    throw new Error("Failed to invite user")
  }
}

// Delete a user
export async function deleteUser(id: string) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    // Get the user from the database
    const user = await prisma.user.findUnique({
      where: { id },
      select: { clerkId: true },
    })

    if (!user) {
      throw new Error("User not found")
    }

    // Delete the user from Clerk
    await clerkClient.users.deleteUser(user.clerkId)

    // Delete the user from the database (this will cascade to delete all related data)
    await prisma.user.delete({
      where: { id },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }
}

// Toggle user role (admin/user)
export async function toggleUserRole(id: string, role: UserRole) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    // Update the user role
    await prisma.user.update({
      where: { id },
      data: { role },
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("Error updating user role:", error)
    throw new Error("Failed to update user role")
  }
}

// Create a category
const categorySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
})

export async function createCategory(formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = categorySchema.parse({
    name: formData.get("name"),
  })

  try {
    // Create the category
    await prisma.category.create({
      data: {
        name: validatedData.name,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error creating category:", error)
    throw new Error("Failed to create category")
  }
}

// Update a category
export async function updateCategory(id: string, formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = categorySchema.parse({
    name: formData.get("name"),
  })

  try {
    // Update the category
    await prisma.category.update({
      where: { id },
      data: {
        name: validatedData.name,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error updating category:", error)
    throw new Error("Failed to update category")
  }
}

// Delete a category
export async function deleteCategory(id: string) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    // Delete the category
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error deleting category:", error)
    throw new Error("Failed to delete category")
  }
}

// Create a family
const familySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
})

export async function createFamily(formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = familySchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
  })

  try {
    // Create the family
    await prisma.family.create({
      data: {
        name: validatedData.name,
        categoryId: validatedData.categoryId,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error creating family:", error)
    throw new Error("Failed to create family")
  }
}

// Update a family
export async function updateFamily(id: string, formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = familySchema.parse({
    name: formData.get("name"),
    categoryId: formData.get("categoryId"),
  })

  try {
    // Update the family
    await prisma.family.update({
      where: { id },
      data: {
        name: validatedData.name,
        categoryId: validatedData.categoryId,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error updating family:", error)
    throw new Error("Failed to update family")
  }
}

// Delete a family
export async function deleteFamily(id: string) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    // Delete the family
    await prisma.family.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error deleting family:", error)
    throw new Error("Failed to delete family")
  }
}

// Create a sub-family
const subFamilySchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  familyId: z.string().min(1, { message: "Family is required" }),
})

export async function createSubFamily(formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = subFamilySchema.parse({
    name: formData.get("name"),
    familyId: formData.get("familyId"),
  })

  try {
    // Create the sub-family
    await prisma.subFamily.create({
      data: {
        name: validatedData.name,
        familyId: validatedData.familyId,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error creating sub-family:", error)
    throw new Error("Failed to create sub-family")
  }
}

// Update a sub-family
export async function updateSubFamily(id: string, formData: FormData) {
  // Ensure the current user is an admin
  await requireAdmin()

  // Validate the form data
  const validatedData = subFamilySchema.parse({
    name: formData.get("name"),
    familyId: formData.get("familyId"),
  })

  try {
    // Update the sub-family
    await prisma.subFamily.update({
      where: { id },
      data: {
        name: validatedData.name,
        familyId: validatedData.familyId,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error updating sub-family:", error)
    throw new Error("Failed to update sub-family")
  }
}

// Delete a sub-family
export async function deleteSubFamily(id: string) {
  // Ensure the current user is an admin
  await requireAdmin()

  try {
    // Delete the sub-family
    await prisma.subFamily.delete({
      where: { id },
    })

    revalidatePath("/admin/categories")
    return { success: true }
  } catch (error) {
    console.error("Error deleting sub-family:", error)
    throw new Error("Failed to delete sub-family")
  }
}

