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
import { createSubFamily, updateSubFamily } from "../../app/actions/admin"
import { handleError } from "@/lib/error-handler"
import { useTranslations } from "next-intl"

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  familyId: z.string().min(1, { message: "Family is required" }),
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

interface SubFamilyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subFamily: SubFamily | null
  categories: Category[]
  onSave: (subFamily: SubFamily, isNew: boolean) => void
}

export function SubFamilyDialog({ open, onOpenChange, subFamily, categories, onSave }: SubFamilyDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!subFamily
  const [availableFamilies, setAvailableFamilies] = useState<Family[]>([])
  const t = useTranslations()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subFamily?.name || "",
      familyId: subFamily?.familyId || "",
      categoryId: "",
    },
  })

  // Get the category ID for the selected family
  useEffect(() => {
    if (subFamily?.familyId) {
      for (const category of categories) {
        const family = category.families.find((f) => f.id === subFamily.familyId)
        if (family) {
          form.setValue("categoryId", category.id)
          break
        }
      }
    }
  }, [subFamily, categories, form])

  // Update available families when category changes
  const selectedCategoryId = form.watch("categoryId")
  useEffect(() => {
    if (selectedCategoryId) {
      const category = categories.find((c) => c.id === selectedCategoryId)
      setAvailableFamilies(category?.families || [])
    } else {
      setAvailableFamilies([])
    }
  }, [selectedCategoryId, categories])

  // Reset form when dialog opens/closes or subFamily changes
  useEffect(() => {
    if (open) {
      form.reset({
        name: subFamily?.name || "",
        familyId: subFamily?.familyId || "",
        categoryId: form.getValues("categoryId") || "",
      })
    }
  }, [open, subFamily, form])

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true)

      if (isEditing && subFamily) {
        // Update existing sub-family
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("familyId", data.familyId)
        await updateSubFamily(subFamily.id, formData)

        onSave({ id: subFamily.id, name: data.name, familyId: data.familyId }, false)
        toast({
          title: t('admin.categories.subfamilyDialog.toast.success.title'),
          description: t('admin.categories.subfamilyDialog.toast.success.updated'),
        })
      } else {
        // Create new sub-family
        const formData = new FormData()
        formData.append("name", data.name)
        formData.append("familyId", data.familyId)
        await createSubFamily(formData)

        // In a real app, you'd get the ID from the server response
        // For now, we'll generate a temporary ID
        const tempId = Math.random().toString(36).substring(2, 9)

        onSave({ id: tempId, name: data.name, familyId: data.familyId }, true)
        toast({
          title: t('admin.categories.subfamilyDialog.toast.success.title'),
          description: t('admin.categories.subfamilyDialog.toast.success.created'),
        })
      }

      onOpenChange(false)
    } catch (error) {
      handleError(error, {
        title: t('admin.categories.subfamilyDialog.toast.error.title'),
        defaultMessage: isEditing 
          ? t('admin.categories.subfamilyDialog.toast.error.update') 
          : t('admin.categories.subfamilyDialog.toast.error.create')
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
              ? t('admin.categories.subfamilyDialog.title.edit') 
              : t('admin.categories.subfamilyDialog.title.create')}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? t('admin.categories.subfamilyDialog.description.edit') 
              : t('admin.categories.subfamilyDialog.description.create')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.subfamilyDialog.fields.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('admin.categories.subfamilyDialog.fields.name.placeholder')} {...field} />
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
                  <FormLabel>{t('admin.categories.subfamilyDialog.fields.category.label')}</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue("familyId", "")
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.categories.subfamilyDialog.fields.category.placeholder')} />
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
            <FormField
              control={form.control}
              name="familyId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('admin.categories.subfamilyDialog.fields.family.label')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={!form.getValues("categoryId")}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('admin.categories.subfamilyDialog.fields.family.placeholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableFamilies.map((family) => (
                        <SelectItem key={family.id} value={family.id}>
                          {family.name}
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
                {t('admin.categories.subfamilyDialog.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? t('admin.categories.subfamilyDialog.buttons.saving') 
                  : isEditing 
                    ? t('admin.categories.subfamilyDialog.buttons.update') 
                    : t('admin.categories.subfamilyDialog.buttons.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

