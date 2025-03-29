"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { toast } from "@/hooks/use-toast"
import { createCategory, updateCategory } from "../../app/actions/admin"
import { useTranslations } from "next-intl"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
})

type FormValues = z.infer<typeof formSchema>

type SubFamily = {
  id: string
  name: string
  familyId: string
}

type Family = {
  id: string
  name: string
  categoryId: string
  subFamilies: SubFamily[]
}

type Category = {
  id: string
  name: string
  families: Family[]
}

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSave: (category: Category, isNew: boolean) => void
}

export function CategoryDialog({ open, onOpenChange, category, onSave }: CategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!category
  const t = useTranslations()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
    },
  })

  // Reset form when dialog opens/closes or category changes
  useState(() => {
    if (open) {
      form.reset({
        name: category?.name || "",
      })
    }
  })

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)

      if (isEditing && category) {
        // Update existing category
        const formData = new FormData()
        formData.append("name", data.name)
        await updateCategory(category.id, formData)

        onSave({ id: category.id, name: data.name, families: category.families }, false)
        toast({
          title: t('admin.categories.categoryDialog.toast.success.title'),
          description: t('admin.categories.categoryDialog.toast.success.updated'),
        })
      } else {
        // Create new category
        const formData = new FormData()
        formData.append("name", data.name)
        const result = await createCategory(formData)

        // In a real app, you'd get the ID from the server response
        // For now, we'll generate a temporary ID
        const tempId = Math.random().toString(36).substring(2, 9)

        onSave({ id: tempId, name: data.name, families: [] }, true)
        toast({
          title: t('admin.categories.categoryDialog.toast.success.title'),
          description: t('admin.categories.categoryDialog.toast.success.created'),
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast({
        title: t('admin.categories.categoryDialog.toast.error.title'),
        description: isEditing 
          ? t('admin.categories.categoryDialog.toast.error.update') 
          : t('admin.categories.categoryDialog.toast.error.create'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
              ? t('admin.categories.categoryDialog.title.edit') 
              : t('admin.categories.categoryDialog.title.create')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('admin.categories.categoryDialog.description.edit') 
              : t('admin.categories.categoryDialog.description.create')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.categoryDialog.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('admin.categories.categoryDialog.fields.name.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('admin.categories.categoryDialog.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? t('admin.categories.categoryDialog.buttons.saving') 
                  : isEditing 
                    ? t('admin.categories.categoryDialog.buttons.update') 
                    : t('admin.categories.categoryDialog.buttons.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

