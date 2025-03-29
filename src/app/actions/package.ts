"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth";

const packageSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  year: z.coerce.number().int().optional(),
  location: z.string().optional(),
  active: z.boolean().default(true),
  image: z
    .object({
      url: z.string(),
      key: z.string(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum(["item", "package"]),
        quantity: z.coerce.number().int().positive().default(1),
      })
    )
    .default([]),
});

export async function createPackage(
  formData: FormData | z.infer<typeof packageSchema>
) {
  const user = await getAuthenticatedUser();

  const data =
    formData instanceof FormData
      ? packageSchema.parse(Object.fromEntries(formData))
      : packageSchema.parse(formData);

  const packageData = await prisma.package.create({
    data: {
      name: data.name,
      description: data.description,
      year: data.year,
      location: data.location,
      active: data.active,
      userId: user.id,
      image: data.image
        ? {
            create: {
              url: data.image.url,
              key: data.image.key,
            },
          }
        : undefined,
      packageItems: {
        create: data.items.map((item) => {
          const packageItem: any = { quantity: item.quantity };
          if (item.type === "item") {
            packageItem.item = { connect: { id: item.id } };
          }
          if (item.type === "package") {
            packageItem.package = { connect: { id: item.id } };
          }
          return packageItem;
        }),
      },
    },
  });

  revalidatePath("/packages");
  return packageData;
}

export async function updatePackage(
  id: string,
  formData: FormData | z.infer<typeof packageSchema>
) {
  const user = await getAuthenticatedUser();

  const data =
    formData instanceof FormData
      ? packageSchema.parse(Object.fromEntries(formData))
      : packageSchema.parse(formData);

  const existingPackage = await prisma.package.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingPackage) {
    throw new Error(
      "Package not found or you do not have permission to update it"
    );
  }

  const packageData = await prisma.package.update({
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
  if (data.image) {
    await prisma.image.upsert({
      where: {
        packageId: id,
      },
      update: {
        url: data.image.url,
        key: data.image.key,
      },
      create: {
        url: data.image.url,
        key: data.image.key,
        packageId: id,
      },
    });
  } else {
    await prisma.image.deleteMany({
      where: {
        packageId: id,
      },
    });
  }

  // Handle package items
  await prisma.packageItem.deleteMany({
    where: {
      packageId: id,
    },
  });

  if (data.items.length > 0) {
    await prisma.packageItem.createMany({
      data: data.items
        .filter((item) => item.type === "item")
        .map((item) => ({
          packageId: id,
          itemId: item.id,
          quantity: item.quantity,
        })),
    });
  }

  revalidatePath("/packages");
  revalidatePath(`/packages/${id}`);
  return packageData;
}

export async function deletePackage(id: string) {
  const user = await getAuthenticatedUser();

  const existingPackage = await prisma.package.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!existingPackage) {
    throw new Error(
      "Package not found or you do not have permission to delete it"
    );
  }

  await prisma.package.delete({
    where: {
      id,
    },
  });

  revalidatePath("/packages");
}
