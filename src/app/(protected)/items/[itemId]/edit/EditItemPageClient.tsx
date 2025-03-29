"use client"

import { updateItem } from "../../../../actions/item"
import { ItemForm, type itemFormSchema } from "../../../../../components/items/item-form"
import type { z } from "zod"

interface EditItemPageClientProps {
  item: z.infer<typeof itemFormSchema>
  itemId: string
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

export default function EditItemPageClient({
  item,
  itemId,
  categories,
  families,
  subFamilies,
}: EditItemPageClientProps) {
  const handleSubmit = async (formData: z.infer<typeof itemFormSchema>) => {
    await updateItem(itemId, formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Item</h1>
        <p className="text-muted-foreground">Update an existing inventory item</p>
      </div>
      <ItemForm
        initialData={item}
        onSubmit={handleSubmit}
        categories={categories}
        families={families}
        subFamilies={subFamilies}
      />
    </div>
  )
}

