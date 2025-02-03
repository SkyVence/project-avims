"use client"

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

  return (
    <Card className="p-6 bg-background">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-primary">Basic Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">SKU:</span>
              <span>{item.sku}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Brand:</span>
              <span>{item.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value:</span>
              <span>${item.value.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span>{item.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span>{item.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Origin:</span>
              <span>{item.origin}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-primary">Dimensions & Weight</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Length:</span>
              <span>{item.length} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Width:</span>
              <span>{item.width} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Height:</span>
              <span>{item.height} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Volume:</span>
              <span>{item.volume} cm³ (calculated)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight:</span>
              <span>{item.weight} kg</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-primary">Financial & Purchase Info</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Assurance Value:</span>
              <span>${item.assuranceValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date of Purchase:</span>
              <span>{item.dateOfPurchase.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">HS Code:</span>
              <span>{item.hsCode}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-primary">Categories & Classifications</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Categories:</span>
              <span>{item.category.map((c) => c.name).join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Families:</span>
              <span>{item.families.map((f) => f.name).join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subfamilies:</span>
              <span>{item.subfamilies.map((s) => s.name).join(", ")}</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-primary">Description</h2>
          <p className="text-muted-foreground">{item.description}</p>
        </div>
      </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/items/${item.id}/edit`}>Edit Item</Link>
        </Button>
        <DeleteButton
          itemId={item.id}
          itemName={item.name}
          onSuccess={() => {
            toast({
              title: "Item Deleted",
              description: `${item.name} has been successfully deleted.`,
            })
            router.push("/items")
          }}
          onError={(error) => {
            toast({
              title: "Error",
              description: error || "Failed to delete item. Please try again.",
              variant: "destructive",
            })
          }}
        />
      </CardFooter>
    </Card>
  )
}

