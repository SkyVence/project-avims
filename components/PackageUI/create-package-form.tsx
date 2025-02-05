"use client"

import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import * as z from "zod"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { BasicInfoFields } from "./basic-info-fields"
import { ItemSelectionFields } from "./item-selection-fields"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  itemIds: z.array(z.string()).min(1, {
    message: "Please select at least one item.",
  }),
})

type FormData = z.infer<typeof formSchema>

export function CreatePackageForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const { toast } = useToast()
  const t = useTranslations("PackageUI")

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      itemIds: [],
    },
  })

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("/api/items")
        if (!response.ok) throw new Error("Failed to fetch items")
        const data = await response.json()
        setItems(data)
      } catch (error) {
        console.error("Error fetching items:", error)
        toast({
          title: t("error"),
          description: t("failedToLoadItems"),
          variant: "destructive",
        })
      }
    }

    fetchItems()
  }, [toast, t])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create package")

      toast({
        title: t("packageCreated"),
        description: t("packageCreatedDescription"),
      })

      router.push("/packages")
      router.refresh()
    } catch (error) {
      toast({
        title: t("error"),
        description: t("problemCreatingPackage"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-full max-h-screen flex flex-col">
      <CardHeader>
        <CardTitle>{t("createNewPackage")}</CardTitle>
        <CardDescription>{t("addNewPackageDescription")}</CardDescription>
      </CardHeader>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <CardContent>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
                <TabsTrigger value="items">{t("items")}</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <BasicInfoFields />
              </TabsContent>
              <TabsContent value="items">
                <ItemSelectionFields items={items} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="ml-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("creating")}
                </>
              ) : (
                t("createPackage")
              )}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  )
}

