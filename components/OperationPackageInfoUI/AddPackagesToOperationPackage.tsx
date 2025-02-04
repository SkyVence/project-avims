"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { useRouter } from "@/i18n/routing"
import { toast } from "@/hooks/use-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ItemDataTableUI/data-table"
import { Checkbox } from "@/components/ui/checkbox"

interface Package {
  id: string
  name: string
  location: string
  totalValue: number
  createdAt: Date
  updatedAt: Date
}

interface AddPackagesToOperationPackageProps {
  operationPackageId: string
  operationPackageName: string
}

export function AddPackagesToOperationPackage({
  operationPackageId,
  operationPackageName,
}: AddPackagesToOperationPackageProps) {
  const router = useRouter()
  const t = useTranslations("addPackagesToOperationPackage")
  const tc = useTranslations("common")
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [allPackages, setAllPackages] = useState<Package[]>([])
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  useEffect(() => {
    fetchAllPackages()
  }, [])

  const fetchAllPackages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/packages")
      if (!response.ok) {
        throw new Error("Failed to fetch packages")
      }
      const data = await response.json()
      const sortedPackages = data.sort((a: Package, b: Package) => a.name.localeCompare(b.name))
      setAllPackages(sortedPackages)
      setFilteredPackages(sortedPackages)
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
      setFilteredPackages(allPackages)
    } else {
      const filtered = allPackages.filter(
        (package_) =>
          package_.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          package_.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPackages(filtered)
    }
  }

  const handleAddPackages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/operation-packages/${operationPackageId}/packages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageIds: selectedPackages }),
      })

      if (!response.ok) {
        throw new Error("Failed to add packages to operation package")
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

  const columns = [
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
              setSelectedPackages((prev) => [...prev, row.original.id])
            } else {
              setSelectedPackages((prev) => prev.filter((id) => id !== row.original.id))
            }
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
          <DataTable columns={columns} data={filteredPackages} enableFilters={true} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.push(`/operation-packages/${operationPackageId}`)}>
          {t("cancel")}
        </Button>
        <Button onClick={handleAddPackages} disabled={isLoading || selectedPackages.length === 0}>
          {isLoading
            ? t("adding")
            : t("add", { count: selectedPackages.length, s: selectedPackages.length !== 1 ? "s" : "" })}
        </Button>
      </CardFooter>
    </Card>
  )
}

