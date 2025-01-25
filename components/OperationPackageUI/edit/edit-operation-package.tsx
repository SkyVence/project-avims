"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./basic-info-fields"
import { ItemSelectionFields } from "./item-selection-fields"
import { PackageSelectionFields } from "./package-selection-fields"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    year: z.string().regex(/^\d{4}$/, {
      message: "Year must be a 4-digit number.",
    }),
    itemIds: z.array(z.string()),
    packageIds: z.array(z.string()),
  })
  .refine((data) => data.itemIds.length > 0 || data.packageIds.length > 0, {
    message: "Please select at least one item or package.",
    path: ["itemIds"],
  })

type Item = {
  id: string
  name: string
  sku: string
}

type Package = {
  id: string
  name: string
}

type OperationPackage = {
  id: string
  name: string
  location: string
  year: string
  itemIds: string[]
  packageIds: string[]
}

export function EditOperationPackageForm({ id }: { id: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [packages, setPackages] = useState<Package[]>([])
  const [operationPackage, setOperationPackage] = useState<OperationPackage | null>(null)
  const { toast } = useToast()
  const t = useTranslations("EditUI")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      year: new Date().getFullYear().toString(),
      itemIds: [],
      packageIds: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, packagesResponse, operationPackageResponse] = await Promise.all([
          fetch("/api/items"),
          fetch("/api/packages"),
          fetch(`/api/operation-packages/${id}`),
        ])

        if (!itemsResponse.ok || !packagesResponse.ok || !operationPackageResponse.ok) {
          throw new Error("Failed to fetch data")
        }

        const [itemsData, packagesData, operationPackageData] = await Promise.all([
          itemsResponse.json(),
          packagesResponse.json(),
          operationPackageResponse.json(),
        ])

        setItems(itemsData)
        setPackages(packagesData)
        setOperationPackage(operationPackageData)

        form.reset({
          name: operationPackageData.name,
          location: operationPackageData.location,
          year: operationPackageData.year,
          itemIds: operationPackageData.itemIds,
          packageIds: operationPackageData.packageIds,
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
      const response = await fetch(`/api/operation-packages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update operation package")
      }

      toast({
        title: t("operationPackageUpdated"),
        description: t("operationPackageUpdatedDescription"),
      })
      router.push("/operation-packages")
      router.refresh()
    } catch (error) {
      toast({
        title: t("error"),
        description: t("problemUpdatingOperationPackage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!operationPackage) {
    return <div>{t("loading")}</div>
  }

  return (
    <Card className="w-full h-full max-h-screen flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("editOperationPackage")}</CardTitle>
        <CardDescription>{t("editOperationPackageDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
                <TabsTrigger value="items">{t("items")}</TabsTrigger>
                <TabsTrigger value="packages">{t("packages")}</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-grow">
                <div className="p-4">
                  <TabsContent value="basic">
                    <BasicInfoFields control={form.control} />
                  </TabsContent>
                  <TabsContent value="items">
                    <ItemSelectionFields control={form.control} items={items} />
                  </TabsContent>
                  <TabsContent value="packages">
                    <PackageSelectionFields control={form.control} packages={packages} />
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
              {t("updating")}
            </>
          ) : (
            t("updateOperationPackage")
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

