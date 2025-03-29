"use client"

import { createItem } from "../../../actions/item"
import { ItemForm, itemFormSchema } from "../../../../components/items/item-form"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface NewItemPageClientProps {
  categories: {
    id: string
    name: string
  }[]
  families: {
    id: string
    name: string
    categoryId: string
  }[]
  subFamilies: {
    id: string
    name: string
    familyId: string
  }[]
}

export default function NewItemPageClient({ categories, families, subFamilies }: NewItemPageClientProps) {
  const t = useTranslations()
  const router = useRouter()
  
  const handleSubmit = async (data: z.infer<typeof itemFormSchema>) => {
    try {
      // Convert the form data to match the server schema
      const serverData = {
        ...data,
        image: data.images[0], // Take the first image if it exists
        brand: data.brand || "", // Ensure required fields are not undefined
        value: data.value || 0,
        insuranceValue: data.insuranceValue || 0,
        hsCode: data.hsCode || "",
        location: data.location || "",
        length: data.length || 0,
        width: data.width || 0,
        height: data.height || 0,
        weight: data.weight || 0,
        categoryId: data.categoryId || "",
        familyId: data.familyId || "",
        subFamilyId: data.subFamilyId || "",
      }
      
      await createItem(serverData)
      toast({
        title: t('items.form.toast.success.create.title'),
        description: t('items.form.toast.success.create.description'),
      })
      router.push("/items")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: t('items.form.toast.error.title'),
        description: t('items.form.toast.error.description'),
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.new.item.heading')}</h1>
        <p className="text-muted-foreground">{t('pages.new.item.subheading')}</p>
      </div>
      <ItemForm onSubmit={handleSubmit} categories={categories} families={families} subFamilies={subFamilies} />
    </div>
  )
}

