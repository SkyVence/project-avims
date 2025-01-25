"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./basic-info-fields"
import { DetailsFields } from "./details-fields"
import { CategoriesFields } from "./categories-fields"
import { useTranslations } from "next-intl"

export function CreateItemForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [families, setFamilies] = useState([])
  const [subfamilies, setSubfamilies] = useState([])
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations("FormsSchema")
  const b = useTranslations("CreateUI")

  const formSchema = z.object({
    name: z.string().min(2, {
      message: t("MinNameString"),
    }),
    description: z.string().min(10, {
      message: t("MinDescriptionString"),

    }),
    brand: z.string().min(2, {
      message: t("MinBrandString"),

    }),
    value: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
      message: t("MinValueString"),

    }),
    location: z.string().min(2, {
      message: t("MinLocationString"),

    }),
    sku: z.string().min(2, {
      message: t("MinSKUString"),

    }),
    quantity: z.string().refine((val) => !isNaN(Number.parseInt(val)) && Number.parseInt(val) > 0, {
      message: t("MinQuantityString"),

    }),
    origin: z.string().min(2, {
      message: t("MinOriginString"),

    }),
    assuranceValue: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
      message: t("MinAssuranceValueString"),

    }),
    dateOfPurchase: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: t("MinDateOfPurchaseString"),

    }),
    length: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
      message: t("MinLength"),

    }),
    width: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
      message: t("MinWidth"),

    }),
    height: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
      message:t("MinHeight"),

    }),
    weight: z.string().refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) >= 0, {
      message: t("MinWeight"),

    }),
    hsCode: z.string().min(2, {
      message: t("MinHsCodeString"),

    }),
    categoryIds: z.array(z.string()).min(1, {
      message: t("MinCategoryString"),

    }),
    familyIds: z.array(z.string()).min(1, {
      message: t("MinFamilyString"),

    }),
    subfamilyIds: z.array(z.string()).min(1, {
      message: t("MinSubfamilyString"),

    }),
  })

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
        const [categoriesResponse, familiesResponse, subfamiliesResponse] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/families"),
          fetch("/api/subfamilies"),
        ])

        if (!categoriesResponse.ok || !familiesResponse.ok || !subfamiliesResponse.ok) {
          throw new Error("Failed to fetch data")
        }

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
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load form data. Please try again later.")
      }
    }

    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
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
      console.error("Error creating item:", error)
      setError("There was a problem creating the item. Please try again.")
      toast({
        title: "Error",
        description: "There was a problem creating the item.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="w-full h-full max-h-screen flex flex-col">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-full max-h-screen flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{b("headerTitle")}</CardTitle>
        <CardDescription>{b("headerDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">{b("BasicInfoTab")}</TabsTrigger>
                <TabsTrigger value="details">{b("DetailsTab")}</TabsTrigger>
                <TabsTrigger value="categories">{b("CategoriesTab")}</TabsTrigger>
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

