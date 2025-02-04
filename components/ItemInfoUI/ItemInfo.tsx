"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "../ui/button"
import { Link } from "@/i18n/routing"

import { DeleteButton } from "./delete-button"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"

interface ItemDetailsProps {
  item: {
    id: string
    name: string
    sku: string
    brand: string
    value: number
    location: string
    quantity: number
    origin: string
    length: number
    width: number
    height: number
    volume: number
    weight: number
    assuranceValue: number
    dateOfPurchase: Date
    hsCode: string
    category: { name: string }[]
    families: { name: string }[]
    subfamilies: { name: string }[]
    description: string
  }
}

export function ItemInfo({ item }: ItemDetailsProps) {
  const router = useRouter()
  const t = useTranslations("itemInfo")
  const td = useTranslations("itemDetails")

  return (
    <Card className="p-6 bg-background">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("basicInfo")}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("sku")}:</span>
                <span>{item.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("brand")}:</span>
                <span>{item.brand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("value")}:</span>
                <span>${item.value.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("location")}:</span>
                <span>{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("quantity")}:</span>
                <span>{item.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("origin")}:</span>
                <span>{item.origin}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("dimensionsWeight")}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("length")}:</span>
                <span>{item.length} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("width")}:</span>
                <span>{item.width} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("height")}:</span>
                <span>{item.height} cm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("volume")}:</span>
                <span>{item.volume} cm³ (calculated)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("weight")}:</span>
                <span>{item.weight} kg</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("financialPurchaseInfo")}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("assuranceValue")}:</span>
                <span>${item.assuranceValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("dateOfPurchase")}:</span>
                <span>{item.dateOfPurchase.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("hsCode")}:</span>
                <span>{item.hsCode}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("categoriesClassifications")}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("categories")}:</span>
                <span>{item.category.map((c) => c.name).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("families")}:</span>
                <span>{item.families.map((f) => f.name).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{td("subfamilies")}:</span>
                <span>{item.subfamilies.map((s) => s.name).join(", ")}</span>
              </div>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("description")}</h2>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/items/${item.id}/edit`}>{t("editItem")}</Link>
        </Button>
        <DeleteButton
          itemId={item.id}
          itemName={item.name}
          onSuccess={() => {
            toast({
              title: t("itemDeleted"),
              description: t("itemDeletedDescription", { itemName: item.name }),
            })
            router.push("/items")
          }}
          onError={(error) => {
            toast({
              title: t("deleteError"),
              description: error || t("deleteErrorDescription"),
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

