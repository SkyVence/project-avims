"use client"

import { updateOperation } from "../../../../actions/operation"
import { OperationForm, operationFormSchema } from "../../../../../components/operations/operation-form"
import type { z } from "zod"
import { toast } from "@/hooks/use-toast"

interface EditOperationPageClientProps {
  operation: z.infer<typeof operationFormSchema>
  operationId: string
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
  packages: {
    id: string
    name: string
    description?: string | null
    image?: {
      url: string
      key: string
    } | null
    packageItems: {
      itemId: string
      quantity: number
      item: {
        name: string
        value: number
      }
    }[]
  }[]
}

export default function EditOperationPageClient({
  operation,
  operationId,
  items,
  packages,
}: EditOperationPageClientProps) {
  const handleSubmit = async (formData: z.infer<typeof operationFormSchema>) => {
    try {
      await updateOperation(operationId, formData)
      toast({
        title: "Operation updated",
        description: "The operation has been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update operation. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Operation</h1>
        <p className="text-muted-foreground">Update an existing operation</p>
      </div>
      <OperationForm initialData={operation} onSubmit={handleSubmit} items={items} packages={packages} />
    </div>
  )
}

