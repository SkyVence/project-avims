"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

// Define the new operation schema
const operationFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  year: z.coerce.number().int().optional().nullable(),
  location: z.string().optional(),
  active: z.boolean().default(true),
  images: z
    .array(
      z.object({
        url: z.string(),
        key: z.string(),
      })
    )
    .default([]),
  operationItems: z
    .array(
      z.object({
        itemId: z.string().optional(),
        packageId: z.string().optional(),
        quantity: z.coerce.number().int().positive().default(1),
      })
    )
    .default([]),
});

export async function createOperation(
  formData: z.infer<typeof operationFormSchema>
) {
  const user = await getAuthenticatedUser();

  // Validate the form data
  const data = operationFormSchema.parse(formData);

  const operation = await prisma.operation.create({
    data: {
      name: data.name,
      description: data.description,
      year: data.year,
      location: data.location,
      active: data.active,
      userId: user.id,
      // Handle image if present
      image: data.images.length > 0
        ? {
            create: {
              url: data.images[0].url,
              key: data.images[0].key,
            },
          }
        : undefined,
      // Create operation items
      operationItems: {
        create: data.operationItems.map((item) => ({
          itemId: item.itemId,
          packageId: item.packageId,
          quantity: item.quantity,
        })),
      },
    },
  });

  revalidatePath("/operations");
  return operation;
}

export async function updateOperation(
  id: string,
  formData: z.infer<typeof operationFormSchema>
) {
  const user = await getAuthenticatedUser();

  // Validate the form data
  const data = operationFormSchema.parse(formData);

  const existingOperation = await prisma.operation.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingOperation) {
    throw new Error(
      "Operation not found or you do not have permission to update it"
    );
  }

  // Update basic operation data
  const operation = await prisma.operation.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      description: data.description,
      year: data.year,
      location: data.location,
      active: data.active,
    },
  });

  // Handle image separately
  if (data.images.length > 0) {
    await prisma.image.upsert({
      where: {
        operationId: id,
      },
      update: {
        url: data.images[0].url,
        key: data.images[0].key,
      },
      create: {
        url: data.images[0].url,
        key: data.images[0].key,
        operationId: id,
      },
    });
  } else {
    await prisma.image.deleteMany({
      where: {
        operationId: id,
      },
    });
  }

  // Handle operation items - delete existing ones
  await prisma.operationItem.deleteMany({
    where: {
      operationId: id,
    },
  });

  // Create new operation items if there are any
  if (data.operationItems.length > 0) {
    await prisma.operationItem.createMany({
      data: data.operationItems.map((item) => ({
        operationId: id,
        itemId: item.itemId,
        packageId: item.packageId,
        quantity: item.quantity,
      })),
    });
  }

  revalidatePath("/operations");
  revalidatePath(`/operations/${id}`);
  return operation;
}

export async function deleteOperation(id: string) {
  const user = await getAuthenticatedUser();

  const existingOperation = await prisma.operation.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingOperation) {
    throw new Error(
      "Operation not found or you do not have permission to delete it"
    );
  }

  await prisma.operation.delete({
    where: {
      id,
    },
  });

  revalidatePath("/operations");
}
