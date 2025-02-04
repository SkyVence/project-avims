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
import { columns as itemColumns } from "@/components/ItemDataTableUI/ItemColumns"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import type React from "react"

interface OperationPackageEditFormProps {
  operationPackage: {
    id: string
    name: string
    location: string
    year: string
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
  } | null
}

export function OperationPackageEditForm({ operationPackage }: OperationPackageEditFormProps) {
  const router = useRouter()
  const t = useTranslations("operationPackageEditForm")
  const tc = useTranslations("common")
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: operationPackage?.name || "",
    location: operationPackage?.location || "",
    year: operationPackage?.year || "",
  })
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  if (!operationPackage) {
    return (
      <Card className="p-6 bg-background">
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[200px]">
            <h2 className="text-lg font-semibold text-muted-foreground">{t("notFound")}</h2>
            <Button asChild className="mt-4">
              <Link href="/operation-packages">{t("backToOperationPackages")}</Link>
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
      const response = await fetch(`/api/operation-packages/${operationPackage.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update operation package")
      }

      toast({
        title: t("success"),
        description: t("successDescription"),
      })
      router.push(`/operation-packages/${operationPackage.id}`)
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
      const response = await fetch(`/api/operation-packages/${operationPackage.id}/items/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds: selectedItems }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove items from operation package")
      }

      toast({
        title: t("success"),
        description: t("removeItemsSuccess"),
      })

      // Refresh the operation package data
      const updatedOperationPackage = await fetch(`/api/operation-packages/${operationPackage.id}`).then((res) =>
        res.json(),
      )
      operationPackage.items = updatedOperationPackage.items
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

  const handleRemovePackages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/operation-packages/${operationPackage.id}/packages/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageIds: selectedPackages }),
      })

      if (!response.ok) {
        throw new Error("Failed to remove packages from operation package")
      }

      toast({
        title: t("success"),
        description: t("removePackagesSuccess"),
      })

      // Refresh the operation package data
      const updatedOperationPackage = await fetch(`/api/operation-packages/${operationPackage.id}`).then((res) =>
        res.json(),
      )
      operationPackage.packages = updatedOperationPackage.packages
      setSelectedPackages([])
    } catch (error) {
      toast({
        title: t("error"),
        description: t("removePackagesError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const packageColumns = [
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
            setSelectedPackages((prev) =>
              value ? [...prev, row.original.id] : prev.filter((id) => id !== row.original.id),
            )
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
    <form onSubmit={handleSubmit}>
      <Card className="p-6 bg-background">
        <CardHeader>
          <CardTitle>{t("title", { name: operationPackage.name })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="year">{t("year")}</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder={t("yearPlaceholder")}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Tabs defaultValue="items">
                <TabsList>
                  <TabsTrigger value="items">{t("manageItems")}</TabsTrigger>
                  <TabsTrigger value="packages">{t("managePackages")}</TabsTrigger>
                </TabsList>
                <TabsContent value="items">
                  <h3 className="text-lg font-semibold text-primary">{t("manageItems")}</h3>
                  <div className="flex justify-between items-center mb-4">
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
                      onClick={() => router.push(`/operation-packages/${operationPackage.id}/items/add`)}
                    >
                      {t("addItems")}
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
                      ...itemColumns,
                    ]}
                    data={operationPackage.items || []}
                    enableFilters={true}
                  />
                </TabsContent>
                <TabsContent value="packages">
                  <h3 className="text-lg font-semibold text-primary">{t("managePackages")}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemovePackages}
                      disabled={isLoading || selectedPackages.length === 0}
                    >
                      {t("removeSelectedPackages")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/operation-packages/${operationPackage.id}/packages/add`)}
                    >
                      {t("addPackages")}
                    </Button>
                  </div>
                  <DataTable columns={packageColumns} data={operationPackage.packages || []} enableFilters={true} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/operation-packages/${operationPackage.id}`)}
          >
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

