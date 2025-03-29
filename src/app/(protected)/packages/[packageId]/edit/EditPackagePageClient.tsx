"use client"

import { updatePackage } from "../../../../actions/package"
import { PackageForm, type packageFormSchema } from "../../../../../components/packages/package-form"
import type { z } from "zod"

interface EditPackagePageClientProps {
  packageData: z.infer<typeof packageFormSchema>
  packageId: string
  items: {
    id: string
    name: string
    description?: string | null
    brand: string
    value: number
    image?: {
      url: string
      key: string
    } | null
    category: {
      name: string
    }
    family: {
      name: string
    }
    subFamily: {
      name: string
    }
  }[]
}

export default function EditPackagePageClient({ packageData, packageId, items }: EditPackagePageClientProps) {
  const handleSubmit = async (formData: z.infer<typeof packageFormSchema>) => {
    const transformedData = {
      ...formData,
      items: formData.packageItems.map((item) => ({
        id: item.itemId,
        type: "item" as "item", // Explicitly set type to "item"
        quantity: item.quantity,
      })),
    };
    await updatePackage(packageId, transformedData);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Package</h1>
        <p className="text-muted-foreground">Update an existing package</p>
      </div>
      <PackageForm initialData={packageData} onSubmit={handleSubmit} items={items} />
    </div>
  )
}

