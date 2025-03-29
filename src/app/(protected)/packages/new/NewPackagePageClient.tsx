"use client"

import { createPackage } from "../../../actions/package"
import { PackageForm, type packageFormSchema } from "../../../../components/packages/package-form"
import type { z } from "zod"
import { useTranslations } from "next-intl"

interface NewPackagePageClientProps {
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

export default function NewPackagePageClient({ items }: NewPackagePageClientProps) {
  const t = useTranslations()
  
  const handleSubmit = async (formData: z.infer<typeof packageFormSchema>) => {
    await createPackage({
      ...formData,
      items: formData.packageItems.map((packageItem) => ({
        id: packageItem.itemId,
        type: "item",
        quantity: packageItem.quantity,
      })),
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.new.package.heading')}</h1>
        <p className="text-muted-foreground">{t('pages.new.package.subheading')}</p>
      </div>
      <PackageForm onSubmit={handleSubmit} items={items} />
    </div>
  )
}

