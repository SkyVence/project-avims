"use client"

import { createOperation } from "../../../actions/operation"
import { OperationForm, operationFormSchema } from "../../../../components/operations/operation-form"
import type { z } from "zod"
import { toast } from "@/hooks/use-toast"
import { handleError } from "@/lib/error-handler"
import { useTranslations } from "next-intl"

interface NewOperationPageClientProps {
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

export default function NewOperationPageClient({ items, packages }: NewOperationPageClientProps) {
  const t = useTranslations()

  const handleSubmit = async (formData: z.infer<typeof operationFormSchema>) => {
    try {
      await createOperation(formData)
      toast({
        title: t('pages.new.operation.toast.success.title'),
        description: t('pages.new.operation.toast.success.description'),
      })
    } catch (error) {
      handleError(error, {
        title: t('pages.new.operation.toast.error.title'),
        defaultMessage: t('pages.new.operation.toast.error.description')
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('pages.new.operation.heading')}</h1>
        <p className="text-muted-foreground">{t('pages.new.operation.subheading')}</p>
      </div>
      <OperationForm onSubmit={handleSubmit} items={items} packages={packages} />
    </div>
  )
}

