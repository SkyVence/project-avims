"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, X } from "lucide-react"
import { Button } from "../ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { toast } from "@/hooks/use-toast"
import { FileUpload } from "../ui/file-upload"
import { Checkbox } from "../ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

export const packageFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  year: z.coerce.number().int().positive().optional(),
  location: z.string().optional(),
  active: z.boolean().default(true),
  image: z
    .object({
      url: z.string(),
      key: z.string(),
    })
    .optional(),
  packageItems: z
    .array(
      z.object({
        itemId: z.string(),
        quantity: z.coerce.number().int().positive().default(1),
      }),
    )
    .default([]),
})

type PackageFormValues = z.infer<typeof packageFormSchema>

interface PackageFormProps {
  initialData?: PackageFormValues
  onSubmit: (data: PackageFormValues) => Promise<void>
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

export function PackageForm({ initialData, onSubmit, items }: PackageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      year: undefined,
      location: "",
      active: true,
      image: undefined,
      packageItems: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "packageItems",
  })

  const handleSubmit = async (data: PackageFormValues) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast({
        title: "Success",
        description: initialData ? "Package updated." : "Package created.",
      })
      router.push("/packages")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter out items that are already selected
  const selectedItemIds = fields.map((field) => field.itemId)
  const availableItems = items.filter((item) => !selectedItemIds.includes(item.id))

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Package name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Package description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="YYYY" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Storage location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>Is this package currently active?</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value ? [field.value] : []}
                      onChange={(files) => field.onChange(files[0] || undefined)}
                      onRemove={() => field.onChange(undefined)}
                      endpoint="imageUploader"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Package Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (availableItems.length === 0) {
                    toast({
                      title: "No items available",
                      description: "All items have been added to the package.",
                      variant: "destructive",
                    })
                    return
                  }
                  append({ itemId: availableItems[0].id, quantity: 1 })
                }}
                disabled={availableItems.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
            {fields.length === 0 ? (
              <div className="rounded-md border border-dashed p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No items added to this package yet. Click "Add Item" to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const selectedItem = items.find((item) => item.id === field.itemId)

                  return (
                    <Card key={field.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{selectedItem?.name || "Select an item"}</CardTitle>
                            <CardDescription>
                              {selectedItem
                                ? `${selectedItem.category.name} > ${selectedItem.family.name} > ${selectedItem.subFamily.name}`
                                : ""}
                            </CardDescription>
                          </div>
                          <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`packageItems.${index}.itemId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Item</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select item" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {/* Include both available items and the currently selected item */}
                                    {[
                                      ...availableItems,
                                      ...(selectedItem && !availableItems.some((i) => i.id === selectedItem.id)
                                        ? [selectedItem]
                                        : []),
                                    ].map((item) => (
                                      <SelectItem key={item.id} value={item.id}>
                                        {item.name}
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
                            name={`packageItems.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        {selectedItem?.image && (
                          <div className="mt-4">
                            <div className="relative h-24 w-24 overflow-hidden rounded-md border">
                              <Image
                                src={selectedItem.image.url || "/placeholder.svg"}
                                alt={selectedItem.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/packages")} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update Package" : "Create Package"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

