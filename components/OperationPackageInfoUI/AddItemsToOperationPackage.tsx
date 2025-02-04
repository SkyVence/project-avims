"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ItemDataTableUI/data-table"
import { columns } from "@/components/ItemDataTableUI/ItemColumns"
import { Checkbox } from "@/components/ui/checkbox"

interface Item {
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
}

interface AddItemsToOperationPackageProps {
  operationPackageId: string
  operationPackageName: string
}

export function AddItemsToOperationPackage({
  operationPackageId,
  operationPackageName,
}: AddItemsToOperationPackageProps) {
  const router = useRouter()
  const t = useTranslations("addItemsToOperationPackage")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [allItems, setAllItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    fetchAllItems()
  }, [])

  const fetchAllItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/items")
      if (!response.ok) {
        throw new Error("Failed to fetch items")
      }
      const data = await response.json()
      const sortedItems = data.sort((a: Item, b: Item) => a.name.localeCompare(b.name))
      setAllItems(sortedItems)
      setFilteredItems(sortedItems)
    } catch (error) {
      toast({
        title: t("error"),
        description: t("fetchError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      setFilteredItems(allItems)
    } else {
      const filtered = allItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredItems(filtered)
    }
  }

  const handleAddItems = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/operation-packages/${operationPackageId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemIds: selectedItems }),
      })

      if (!response.ok) {
        throw new Error("Failed to add items to operation package")
      }

      toast({
        title: t("success"),
        description: t("successDescription"),
      })
      router.push(`/operation-packages/${operationPackageId}`)
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

  const selectionColumns = [
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
            if (value) {
              setSelectedItems((prev) => [...prev, row.original.id])
            } else {
              setSelectedItems((prev) => prev.filter((id) => id !== row.original.id))
            }
          }}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...columns,
  ]

  return (
    <Card className="p-6 bg-background">
      <CardHeader>
        <CardTitle>{t("title", { operationPackageName })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                handleSearch()
              }}
              className="flex-grow"
            />
          </div>
          <DataTable columns={selectionColumns} data={filteredItems} enableFilters={true} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push(`/operation-packages/${operationPackageId}`)}>
          {t("cancel")}
        </Button>
        <Button onClick={handleAddItems} disabled={isLoading || selectedItems.length === 0}>
          {isLoading
            ? t("adding")
            : t("add", { count: selectedItems.length, s: selectedItems.length !== 1 ? "s" : "" })}
        </Button>
      </CardFooter>
    </Card>
  )
}

