"use client"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"
import { DataTable } from "@/components/ItemDataTableUI/data-table"
import { columns as itemColumns } from "@/components/ItemDataTableUI/ItemColumns"
import { DeleteButton } from "./delete-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OperationPackageDetailsProps {
  operationPackage: {
    id: string
    name: string
    location: string
    year: string
    createdAt: Date
    updatedAt: Date
    items: Array<{
      id: string
      name: string
      sku: string
      value: number
      assuranceValue: number
      location: string
      quantity: number
      brand: string
      category: { id: string; name: string }[]
      families: { id: string; name: string }[]
      subfamilies: { id: string; name: string }[]
      updatedAt: Date
    }>
    packages: Array<{
      id: string
      name: string
      location: string
      totalValue: number
      createdAt: Date
      updatedAt: Date
    }>
  }
}

export function OperationPackageInfo({ operationPackage }: OperationPackageDetailsProps) {
  const router = useRouter()
  const t = useTranslations("operationPackageInfo")
  const tc = useTranslations("common")

  const packageColumns = [
    { accessorKey: "name", header: tc("name") },
    { accessorKey: "location", header: t("location") },
    {
      accessorKey: "totalValue",
      header: tc("totalValue"),
      cell: ({ row }) => {
        return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(row.original.totalValue)
      },
    },
  ]

  return (
    <Card className="p-6 bg-background">
      <CardHeader>
        <CardTitle>{operationPackage.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">{t("information")}</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("location")}:</span>
                <span>{operationPackage.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("year")}:</span>
                <span>{operationPackage.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("createdAt")}:</span>
                <span>{operationPackage.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("updatedAt")}:</span>
                <span>{operationPackage.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">{t("items")}</TabsTrigger>
              <TabsTrigger value="packages">{t("packages")}</TabsTrigger>
            </TabsList>
            <TabsContent value="items">
              <h2 className="text-lg font-semibold mb-4 text-primary">{t("itemsInPackage")}</h2>
              <DataTable columns={itemColumns} data={operationPackage.items} />
            </TabsContent>
            <TabsContent value="packages">
              <h2 className="text-lg font-semibold mb-4 text-primary">{t("packagesInPackage")}</h2>
              <DataTable columns={packageColumns} data={operationPackage.packages} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/operation-packages/${operationPackage.id}/edit`}>{t("editOperationPackage")}</Link>
        </Button>
        <DeleteButton
          itemId={operationPackage.id}
          itemName={operationPackage.name}
          onSuccess={() => {
            toast({
              title: t("operationPackageDeleted"),
              description: t("deleteSuccess", { name: operationPackage.name }),
            })
            router.push("/operation-packages")
          }}
          onError={(error) => {
            toast({
              title: t("error"),
              description: error || t("deleteError"),
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

