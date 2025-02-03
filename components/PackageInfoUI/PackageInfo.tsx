"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"
import { DataTable } from "@/components/ItemDataTableUI/data-table"
import { columns } from "@/components/ItemDataTableUI/ItemColumns"
import { DeleteButton } from "./delete-button"

interface PackageDetailsProps {
  package_:
    | {
        id: string
        name: string
        location: string
        totalValue: number
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
        }> | null
      }
    | null
    | undefined
}

export function PackageInfo({ package_ }: PackageDetailsProps) {
  const router = useRouter()

  if (!package_) {
    return (
      <Card className="p-6 bg-background">
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px]">
            <h2 className="text-lg font-semibold text-muted-foreground">Package not found</h2>
            <Button asChild className="mt-4">
              <Link href="/packages">Back to Packages</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="p-6 bg-background">
      <CardHeader>
        <CardTitle>{package_.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-muted p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4 text-primary">Package Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{package_.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Value:</span>
                <span>
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(package_.totalValue)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At:</span>
                <span>{package_.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Updated At:</span>
                <span>{package_.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4 text-primary">Items in Package</h2>
          <DataTable columns={columns} data={package_.items || []} enableFilters={true} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button asChild>
          <Link href={`/packages/${package_.id}/edit`}>Edit Package</Link>
        </Button>
        <DeleteButton
          itemId={package_.id}
          itemName={package_.name}
          onSuccess={() => {
            toast({
              title: "Package Deleted",
              description: `${package_.name} has been successfully deleted.`,
            })
            router.push("/packages")
          }}
          onError={(error) => {
            toast({
              title: "Error",
              description: error || "Failed to delete package. Please try again.",
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

