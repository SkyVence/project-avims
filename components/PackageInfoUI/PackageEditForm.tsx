"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataTable } from "@/components/ItemDataTableUI/data-table"
import { columns } from "@/components/ItemDataTableUI/ItemColumns"
import { Link } from "@/i18n/routing"
import { Checkbox } from "@/components/ui/checkbox"
import type React from "react" // Added import for React

interface PackageEditFormProps {
  package_: {
    id: string
    name: string
    location: string
    totalValue: number
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
  } | null
}

export function PackageEditForm({ package_ }: PackageEditFormProps) {
  const router = useRouter()
  const t = useTranslations("packageEditForm")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: package_?.name || "",
    location: package_?.location || "",
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  if (!package_) {
    return (
      <Card className="p-6 bg-background">
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px]">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("packageNotFound")}</h2>
            <Button asChild className="mt-4">
              <Link href="/packages">{t("backToPackages")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`/api/packages/${package_.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update package")
      }

      toast({
        title: t("success"),
        description: t("successDescription"),
      })
      router.push(`/packages/${package_.id}`)
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorDescription"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/packages/${package_.id}/items/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds: selectedItems }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove items from package")
      }

      toast({
        title: t("success"),
        description: t("removeItemsSuccess"),
      })

      // Refresh the package data
      const updatedPackage = await fetch(`/api/packages/${package_.id}`).then((res) => res.json())
      setFormData({
        name: updatedPackage.name,
        location: updatedPackage.location,
      })
      package_.items = updatedPackage.items
      package_.totalValue = updatedPackage.totalValue
      setSelectedItems([])
    } catch (error) {
      toast({
        title: t("error"),
        description: t("removeItemsError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="p-6 bg-background">
        <CardHeader>
          <CardTitle>{t("title", { name: package_.name })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("packageName")}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t("location")}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder={t("locationPlaceholder")}
                    required
                  />
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-sm font-medium mb-2">{t("packageSummary")}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("totalValue")}:</span>
                    <span>
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                        package_.totalValue,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("totalItems")}:</span>
                    <span>{package_.items?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">{t("manageItems")}</h3>
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleRemoveItems}
                  disabled={isLoading || selectedItems.length === 0}
                >
                  {t("removeSelectedItems")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/packages/${package_.id}/items/add`)}
                >
                  {t("addItemsToPackage")}
                </Button>
              </div>
              <DataTable
                columns={[
                  {
                    id: "select",
                    header: ({ table }) => (
                      <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                      />
                    ),
                    cell: ({ row }) => (
                      <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => {
                          row.toggleSelected(!!value)
                          setSelectedItems((prev) =>
                            value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id),
                          )
                        }}
                        aria-label="Select row"
                      />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                  },
                  ...columns,
                ]}
                data={package_.items || []}
                enableFilters={true}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.push(`/packages/${package_.id}`)}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("saveChanges")}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

