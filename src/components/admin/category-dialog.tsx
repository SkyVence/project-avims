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
          title: "Success",
          description: "Category updated successfully.",
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
          title: "Success",
          description: "Category created successfully.",
        })
      }

      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: isEditing ? "Failed to update category." : "Failed to create category.",
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
          <DialogTitle>{isEditing ? "Edit Category" : "Create Category"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the category details." : "Add a new category to the system."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

