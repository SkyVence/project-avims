"use client"

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
import {Link} from "@/i18n/routing"
import type React from "react" // Added import for React

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
            <h2 className="text-lg font-semibold text-muted-foreground">Operation Package not found</h2>
            <Button asChild className="mt-4">
              <Link href="/operation-packages">Back to Operation Packages</Link>
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
        title: "Success",
        description: "Operation Package updated successfully",
      })
      router.push(`/operation-packages/${operationPackage.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update operation package. Please try again.",
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
        title: "Success",
        description: "Items removed from operation package successfully",
      })

      // Refresh the operation package data
      const updatedOperationPackage = await fetch(`/api/operation-packages/${operationPackage.id}`).then((res) =>
        res.json(),
      )
      operationPackage.items = updatedOperationPackage.items
      setSelectedItems([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove items from operation package. Please try again.",
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
        title: "Success",
        description: "Packages removed from operation package successfully",
      })

      // Refresh the operation package data
      const updatedOperationPackage = await fetch(`/api/operation-packages/${operationPackage.id}`).then((res) =>
        res.json(),
      )
      operationPackage.packages = updatedOperationPackage.packages
      setSelectedPackages([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove packages from operation package. Please try again.",
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
    <form onSubmit={handleSubmit}>
      <Card className="p-6 bg-background">
        <CardHeader>
          <CardTitle>Edit Operation Package: {operationPackage.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Operation Package Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter operation package name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    placeholder="Enter year"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Tabs defaultValue="items">
                <TabsList>
                  <TabsTrigger value="items">Items</TabsTrigger>
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                </TabsList>
                <TabsContent value="items">
                  <h3 className="text-lg font-semibold text-primary">Manage Items</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemoveItems}
                      disabled={isLoading || selectedItems.length === 0}
                    >
                      Remove Selected Items
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/operation-packages/${operationPackage.id}/items/add`)}
                    >
                      Add Items to Operation Package
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
                  <h3 className="text-lg font-semibold text-primary">Manage Packages</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRemovePackages}
                      disabled={isLoading || selectedPackages.length === 0}
                    >
                      Remove Selected Packages
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/operation-packages/${operationPackage.id}/packages/add`)}
                    >
                      Add Packages to Operation Package
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
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

