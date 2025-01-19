"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  brand: z.string().min(2, {
    message: "Brand must be at least 2 characters.",
  }),
  value: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
    message: "Value must be a positive number.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  sku: z.string().min(2, {
    message: "SKU must be at least 2 characters.",
  }),
  quantity: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
    message: "Quantity must be a positive integer.",
  }),
  origin: z.string().min(2, {
    message: "Origin must be at least 2 characters.",
  }),
  assuranceValue: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Assurance value must be a non-negative number.",
  }),
  dateOfPurchase: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  }),
  length: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Length must be a non-negative number.",
  }),
  width: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Width must be a non-negative number.",
  }),
  height: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Height must be a non-negative number.",
  }),
  weight: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
    message: "Weight must be a non-negative number.",
  }),
  hsCode: z.string().min(2, {
    message: "HS Code must be at least 2 characters.",
  }),
  categoryIds: z.array(z.string()).min(1, {
    message: "Please select at least one category.",
  }),
  familyIds: z.array(z.string()).min(1, {
    message: "Please select at least one family.",
  }),
  subfamilyIds: z.array(z.string()).min(1, {
    message: "Please select at least one subfamily.",
  }),
})

export function CreateItemForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [families, setFamilies] = useState([])
  const [subfamilies, setSubfamilies] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const [categoriesResponse, familiesResponse, subfamiliesResponse] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/families"),
        fetch("/api/subfamilies"),
      ])
      const [categoriesData, familiesData, subfamiliesData] = await Promise.all([
        categoriesResponse.json(),
        familiesResponse.json(),
        subfamiliesResponse.json(),
      ])
      setCategories(
        categoriesData.map((category: any) => ({
          value: category.id,
          label: category.name,
        })),
      )
      setFamilies(
        familiesData.map((family: any) => ({
          value: family.id,
          label: family.name,
        })),
      )
      setSubfamilies(
        subfamiliesData.map((subfamily: any) => ({
          value: subfamily.id,
          label: subfamily.name,
        })),
      )
    }
    fetchData()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      value: "",
      location: "",
      sku: "",
      quantity: "1",
      origin: "",
      assuranceValue: "0",
      dateOfPurchase: new Date().toISOString().split("T")[0],
      length: "0",
      width: "0",
      height: "0",
      weight: "0",
      hsCode: "",
      categoryIds: [],
      familyIds: [],
      subfamilyIds: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create item")
      }

      const newItem = await response.json()

      toast({
        title: "Item created",
        description: "Your new item has been created successfully.",
      })
      router.push("/items")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating the item.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Item</CardTitle>
        <CardDescription>Add a new item to your inventory</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                <TabsContent value="basic">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Item name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Item brand" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Item value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Item quantity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Item description" className="h-32" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Item location" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="Item SKU" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="origin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origin</FormLabel>
                          <FormControl>
                            <Input placeholder="Item origin" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="assuranceValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assurance Value</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Assurance value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateOfPurchase"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Purchase</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hsCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HS Code</FormLabel>
                          <FormControl>
                            <Input placeholder="HS Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Length" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Width" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Height" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Weight" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="categories">
                  <div className="grid grid-cols-1 gap-4">
                    <FormField
                      control={form.control}
                      name="categoryIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categories</FormLabel>
                          <FormControl>
                            <Controller
                              name="categoryIds"
                              control={form.control}
                              render={({ field }) => (
                                <MultiSelect
                                  options={categories}
                                  selected={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select categories"
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="familyIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Families</FormLabel>
                          <FormControl>
                            <Controller
                              name="familyIds"
                              control={form.control}
                              render={({ field }) => (
                                <MultiSelect
                                  options={families}
                                  selected={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select families"
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subfamilyIds"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subfamilies</FormLabel>
                          <FormControl>
                            <Controller
                              name="subfamilyIds"
                              control={form.control}
                              render={({ field }) => (
                                <MultiSelect
                                  options={subfamilies}
                                  selected={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select subfamilies"
                                />
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Item"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

