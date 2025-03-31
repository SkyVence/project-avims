"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getAuthenticatedUser } from "@/lib/auth"

const imageSchema = z.object({
  url: z.string(),
  key: z.string(),
});

const itemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string(),
  value: z.coerce.number(),
  insuranceValue: z.coerce.number(),
  hsCode: z.string(),
  location: z.string(),
  length: z.coerce.number(),
  width: z.coerce.number(),
  height: z.coerce.number(),
  weight: z.coerce.number(),
  categoryId: z.string(),
  familyId: z.string(),
  subFamilyId: z.string(),
  quantity: z.coerce.number().int().positive().default(1),
  images: z.array(imageSchema).default([]),
})

export async function createItem(formData: FormData | z.infer<typeof itemSchema>) {
  // Get authenticated user (this will also sync user data)
  const user = await getAuthenticatedUser()

  // Check if we received FormData or already parsed data
  const data =
    formData instanceof FormData ? itemSchema.parse(Object.fromEntries(formData)) : itemSchema.parse(formData)

  try {
    // Create the item without images initially
    const item = await prisma.item.create({
      data: {
        name: data.name,
        description: data.description,
        brand: data.brand,
        value: data.value,
        insuranceValue: data.insuranceValue,
        hsCode: data.hsCode,
        location: data.location,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
        categoryId: data.categoryId,
        familyId: data.familyId,
        subFamilyId: data.subFamilyId,
        quantity: data.quantity,
        userId: user.id,
      },
    });

    // If we have images, use the first one as the item's image
    // (since our database model only allows one image per item)
    if (data.images.length > 0) {
      const firstImage = data.images[0];
      
      // Check if the image with this key already exists
      const existingImage = await prisma.image.findUnique({
        where: { key: firstImage.key }
      });
      
      if (existingImage) {
        // If the image exists but is not linked to any item (itemId is null)
        if (!existingImage.itemId && !existingImage.packageId && !existingImage.operationId) {
          // Update the existing image to link it to this item
          await prisma.image.update({
            where: { key: firstImage.key },
            data: { itemId: item.id }
          });
        } else {
          // If image is already linked to another entity, create a new image record with same URL but a modified key
          await prisma.image.create({
            data: {
              url: firstImage.url,
              key: `${firstImage.key}_${item.id}`, // Make key unique by appending item ID
              itemId: item.id,
            },
          });
        }
      } else {
        // Create a new image if it doesn't exist
        await prisma.image.create({
          data: {
            url: firstImage.url,
            key: firstImage.key,
            itemId: item.id,
          },
        });
      }
    }

    revalidatePath("/items");
    revalidatePath(`/items/${item.id}`);
    return item;
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
}

export async function updateItem(id: string, formData: FormData | z.infer<typeof itemSchema>) {
  // Get authenticated user (this will also sync user data)
  const user = await getAuthenticatedUser()

  // Check if we received FormData or already parsed data
  const data =
    formData instanceof FormData ? itemSchema.parse(Object.fromEntries(formData)) : itemSchema.parse(formData)

  try {
    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        image: true,
      },
    })

    if (!existingItem) {
      throw new Error("Item not found !")
    }

    // Update the item
    const item = await prisma.item.update({
      where: {
        id,
      },
      data: {
        name: data.name,
        description: data.description,
        brand: data.brand,
        value: data.value,
        insuranceValue: data.insuranceValue,
        hsCode: data.hsCode,
        location: data.location,
        length: data.length,
        width: data.width,
        height: data.height,
        weight: data.weight,
        categoryId: data.categoryId,
        familyId: data.familyId,
        subFamilyId: data.subFamilyId,
        quantity: data.quantity,
      },
    })

    // Handle the image separately
    // If there's an existing image, delete it
    if (existingItem.image) {
      await prisma.image.delete({
        where: {
          id: existingItem.image.id,
        },
      })
    }

    // If new images are provided, create the first one as the item's image
    if (data.images.length > 0) {
      const firstImage = data.images[0];
      
      // Check if the image with this key already exists
      const existingImage = await prisma.image.findUnique({
        where: { key: firstImage.key }
      });
      
      if (existingImage) {
        // If the image exists but is not linked to any item (itemId is null)
        if (!existingImage.itemId && !existingImage.packageId && !existingImage.operationId) {
          // Update the existing image to link it to this item
          await prisma.image.update({
            where: { key: firstImage.key },
            data: { itemId: id }
          });
        } else {
          // If image is already linked to another entity, create a new image record with same URL but a modified key
          await prisma.image.create({
            data: {
              url: firstImage.url,
              key: `${firstImage.key}_${id}`, // Make key unique by appending item ID
              itemId: id,
            },
          });
        }
      } else {
        // Create a new image if it doesn't exist
        await prisma.image.create({
          data: {
            url: firstImage.url,
            key: firstImage.key,
            itemId: id,
          },
        });
      }
    }

    revalidatePath("/items")
    revalidatePath(`/items/${id}`)
    return item
  } catch (error) {
    console.error("Error updating item:", error)
    throw error
  }
}

export async function deleteItem(id: string) {
  // Get authenticated user (this will also sync user data)
  const user = await getAuthenticatedUser()

  // Check if item exists and belongs to user
  const existingItem = await prisma.item.findFirst({
    where: {
      id,
    },
  })

  if (!existingItem) {
    throw new Error("Item not found !")
  }

  // Delete the item (image will be deleted via cascade)
  await prisma.item.delete({
    where: {
      id,
    },
  })

  revalidatePath("/items")
}

export type ItemWithIds = {
  name: string
  description?: string
  brand: string
  value: number
  insuranceValue: number
  hsCode: string
  location: string
  length: number
  width: number
  height: number
  weight: number
  quantity: number
  categoryId: string
  familyId: string
  subFamilyId: string
}

export async function createItemBulk(items: ItemWithIds[]) {
  try {
    const user = await getAuthenticatedUser()
    
    let successCount = 0
    let failedCount = 0
    
    // Process each item
    for (const item of items) {
      try {
        await prisma.item.create({
          data: {
            name: item.name,
            description: item.description,
            brand: item.brand,
            value: item.value,
            insuranceValue: item.insuranceValue,
            hsCode: item.hsCode,
            location: item.location,
            length: item.length,
            width: item.width,
            height: item.height,
            weight: item.weight,
            quantity: item.quantity,
            categoryId: item.categoryId,
            familyId: item.familyId,
            subFamilyId: item.subFamilyId,
            userId: user.id,
          },
        })
        successCount++
      } catch (error) {
        console.error("Error creating item:", error)
        failedCount++
      }
    }
    
    return {
      success: successCount,
      failed: failedCount,
    }
  } catch (error) {
    console.error("Error in bulk import:", error)
    throw new Error(
      error instanceof Error ? error.message : "An unknown error occurred during bulk import"
    )
  }
}

