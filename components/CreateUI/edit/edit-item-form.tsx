"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./basic-info-fields"
import { DetailsFields } from "./details-fields"
import { CategoriesFields } from "./categories-fields"

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

type Category = {
  id: string
  name: string
}

type Family = {
  id: string
  name: string
}

type Subfamily = {
  id: string
  name: string
}

type Item = z.infer<typeof formSchema>

export function EditItemForm({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [families, setFamilies] = useState<Family[]>([])
  const [subfamilies, setSubfamilies] = useState<Subfamily[]>([])
  const [item, setItem] = useState<Item | null>(null)
  const { toast } = useToast()
  const t = useTranslations("EditItemUI")

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, familiesResponse, subfamiliesResponse, itemResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/families"),
          fetch("/api/subfamilies"),
          fetch(`/api/items/${id}`),
        ])

        if (!categoriesResponse.ok || !familiesResponse.ok || !subfamiliesResponse.ok || !itemResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [categoriesData, familiesData, subfamiliesData, itemData] = await Promise.all([
          categoriesResponse.json(),
          familiesResponse.json(),
          subfamiliesResponse.json(),
          itemResponse.json(),
        ])

        setCategories(categoriesData)
        setFamilies(familiesData)
        setSubfamilies(subfamiliesData)
        setItem(itemData)

        form.reset({
          ...itemData,
          value: itemData.value.toString(),
          quantity: itemData.quantity.toString(),
          assuranceValue: itemData.assuranceValue.toString(),
          length: itemData.length.toString(),
          width: itemData.width.toString(),
          height: itemData.height.toString(),
          weight: itemData.weight.toString(),
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: t("error"),
          description: t("failedToLoadData"),
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [id, form, toast, t])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update item")
      }

      toast({
        title: t("itemUpdated"),
        description: t("itemUpdatedDescription"),
      })
      router.push("/items")
      router.refresh()
    } catch (error) {
      toast({
        title: t("error"),
        description: t("problemUpdatingItem"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!item) {
    return <div>{t("loading")}</div>
  }

  return (
    <Card className="w-full h-full max-h-screen flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("editItem")}</CardTitle>
        <CardDescription>{t("editItemDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit(onSubmit)(e)
            }}
            className="h-full flex flex-col"
          >
            <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
                <TabsTrigger value="details">{t("details")}</TabsTrigger>
                <TabsTrigger value="categories">{t("categories")}</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-grow">
                <div className="p-4">
                  <TabsContent value="basic">
                    <BasicInfoFields control={form.control} />
                  </TabsContent>
                  <TabsContent value="details">
                    <DetailsFields control={form.control} />
                  </TabsContent>
                  <TabsContent value="categories">
                    <CategoriesFields
                      control={form.control}
                      categories={categories}
                      families={families}
                      subfamilies={subfamilies}
                    />
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
            <div className="sticky bottom-0 p-4 bg-background border-t">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("updating")}
                  </>
                ) : (
                  t("updateItem")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

