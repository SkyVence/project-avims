"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "@/hooks/use-toast"
import { createFamily, updateFamily } from "../../app/actions/admin"
import { handleError } from "@/lib/error-handler"
import { useTranslations } from "next-intl"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
})

type FormValues = z.infer<typeof formSchema>

type Category = {
  id: string
  name: string
}

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

interface FamilyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  family: Family | null
  categories: Category[]
  onSave: (family: Family, isNew: boolean) => void
}

export function FamilyDialog({ open, onOpenChange, family, categories, onSave }: FamilyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!family
  const t = useTranslations()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: family?.name || "",
      categoryId: family?.categoryId || "",
    },
  })

  // Reset form when dialog opens/closes or family changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: family?.name || "",
        categoryId: family?.categoryId || "",
      })
    }
  }, [open, family, form])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)

      if (isEditing && family) {
        // Update existing family
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("categoryId", data.categoryId)
        await updateFamily(family.id, formData)

        onSave({ id: family.id, name: data.name, categoryId: data.categoryId, subFamilies: family.subFamilies }, false)
        toast({
          title: t('admin.categories.familyDialog.toast.success.title'),
          description: t('admin.categories.familyDialog.toast.success.updated'),
        })
      } else {
        // Create new family
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("categoryId", data.categoryId)
        await createFamily(formData)

        // In a real app, you'd get the ID from the server response
        // For now, we'll generate a temporary ID
        const tempId = Math.random().toString(36).substring(2, 9)

        onSave({ id: tempId, name: data.name, categoryId: data.categoryId, subFamilies: [] }, true)
        toast({
          title: t('admin.categories.familyDialog.toast.success.title'),
          description: t('admin.categories.familyDialog.toast.success.created'),
        })
      }

      onOpenChange(false)
    } catch (error) {
      handleError(error, {
        title: t('admin.categories.familyDialog.toast.error.title'),
        defaultMessage: isEditing 
          ? t('admin.categories.familyDialog.toast.error.update') 
          : t('admin.categories.familyDialog.toast.error.create')
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
              ? t('admin.categories.familyDialog.title.edit') 
              : t('admin.categories.familyDialog.title.create')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('admin.categories.familyDialog.description.edit') 
              : t('admin.categories.familyDialog.description.create')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.familyDialog.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('admin.categories.familyDialog.fields.name.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.familyDialog.fields.category.label')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.categories.familyDialog.fields.category.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                {t('admin.categories.familyDialog.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? t('admin.categories.familyDialog.buttons.saving') 
                  : isEditing 
                    ? t('admin.categories.familyDialog.buttons.update') 
                    : t('admin.categories.familyDialog.buttons.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

