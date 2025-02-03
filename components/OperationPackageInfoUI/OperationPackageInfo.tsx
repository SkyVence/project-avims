"use client"
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

  const packageColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "location", header: "Location" },
    {
      accessorKey: "totalValue",
      header: "Total Value",
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
            <h2 className="text-lg font-semibold mb-4 text-primary">Operation Package Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{operationPackage.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Year:</span>
                <span>{operationPackage.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At:</span>
                <span>{operationPackage.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated At:</span>
                <span>{operationPackage.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Tabs defaultValue="items">
            <TabsList>
              <TabsTrigger value="items">Items</TabsTrigger>
              <TabsTrigger value="packages">Packages</TabsTrigger>
            </TabsList>
            <TabsContent value="items">
              <h2 className="text-lg font-semibold mb-4 text-primary">Items in Operation Package</h2>
              <DataTable columns={itemColumns} data={operationPackage.items} />
            </TabsContent>
            <TabsContent value="packages">
              <h2 className="text-lg font-semibold mb-4 text-primary">Packages in Operation Package</h2>
              <DataTable columns={packageColumns} data={operationPackage.packages} />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/operation-packages/${operationPackage.id}/edit`}>Edit Operation Package</Link>
        </Button>
        <DeleteButton
          itemId={operationPackage.id}
          itemName={operationPackage.name}
          onSuccess={() => {
            toast({
              title: "Operation Package Deleted",
              description: `${operationPackage.name} has been successfully deleted.`,
            })
            router.push("/operation-packages")
          }}
          onError={(error) => {
            toast({
              title: "Error",
              description: error || "Failed to delete operation package. Please try again.",
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

