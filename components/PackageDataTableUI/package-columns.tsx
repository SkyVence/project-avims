"use client"

import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"

export type Package = {
  id: string
  name: string
  location: string
  totalValue: number
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<Package>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useTranslations("aria")
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("selectAll")}
        />
      )
    },
    cell: ({ row }) => {
      const t = useTranslations("aria")
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("selectRow")}
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const t = useTranslations("columns")
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <Link href={`/packages/${row.original.id}`} className="hover:underline">
          {row.getValue("name")}
        </Link>
      )
    },
  },
  {
    accessorKey: "location",
    header: () => {
      const t = useTranslations("columns")
      return t("location")
    },
    filterFn: (row, id, value) => {
      return row.getValue(id) === value
    },
  },
  {
    accessorKey: "totalValue",
    header: () => {
      const t = useTranslations("columns")
      return <div className="text-right">{t("totalValue")}</div>
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalValue"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: () => {
      const t = useTranslations("columns")
      return t("createdAt")
    },
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString()
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => {
      const t = useTranslations("columns")
      return t("updatedAt")
    },
    cell: ({ row }) => {
      return new Date(row.getValue("updatedAt")).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const t = useTranslations("actions")
      const package_ = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(package_.id)}>
              {t("copyPackageId")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/packages/${package_.id}`}>{t("viewDetails")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/packages/${package_.id}/edit`}>{t("editItem")}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

