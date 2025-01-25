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

type Item = {
  id: string
  name: string
  sku: string
}

export function CreatePackageForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const { toast } = useToast()
  const t = useTranslations("PackageUI")

  const form = useForm<z.infer<typeof formSchema>>({
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
        if (!response.ok) {
          throw new Error("Failed to fetch items")
        }
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to create package")
      }

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
        <CardTitle className="text-2xl font-bold">{t("createNewPackage")}</CardTitle>
        <CardDescription>{t("addNewPackageDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
            <Tabs defaultValue="basic" className="w-full h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
                <TabsTrigger value="items">{t("items")}</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-grow">
                <div className="p-4">
                  <TabsContent value="basic">
                    <BasicInfoFields control={form.control} />
                  </TabsContent>
                  <TabsContent value="items">
                    <ItemSelectionFields control={form.control} items={items} />
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
              {t("creating")}
            </>
          ) : (
            t("createPackage")
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

