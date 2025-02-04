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

export type Item = {
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
  updatedAt: number
}

export const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useTranslations("columns")
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("select")}
        />
      )
    },
    cell: ({ row }) => {
      const t = useTranslations("columns")
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("select")}
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
        <Link href={`/items/${row.original.id}`} className="hover:underline">
          {row.getValue("name")}
        </Link>
      )
    },
  },
  {
    accessorKey: "brand",
    header: () => {
      const t = useTranslations("columns")
      return t("brand")
    },
  },
  {
    accessorKey: "families",
    header: () => {
      const t = useTranslations("columns")
      return t("family")
    },
    cell: ({ row }) => {
      const families = row.original.families || []
      return (
        <div className="flex flex-wrap gap-1">
          {families.map((fam) => (
            <span key={fam.id} className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {fam.name}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.original.families.some((family) => family.name === value)
    },
  },
  {
    accessorKey: "subfamilies",
    header: () => {
      const t = useTranslations("columns")
      return t("subFamily")
    },
    cell: ({ row }) => {
      const subfamilies = row.original.subfamilies || []
      return (
        <div className="flex flex-wrap gap-1">
          {subfamilies.map((subfam) => (
            <span key={subfam.id} className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {subfam.name}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.original.subfamilies.some((subfamily) => subfamily.name === value)
    },
  },
  {
    accessorKey: "category",
    header: () => {
      const t = useTranslations("columns")
      return t("categories")
    },
    cell: ({ row }) => {
      const categories = row.original.category || []
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <span key={cat.id} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              {cat.name}
            </span>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return row.original.category.some((category) => category.name === value)
    },
  },
  {
    accessorKey: "value",
    header: () => {
      const t = useTranslations("columns")
      return <div className="text-right">{t("value")}</div>
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("value"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "assuranceValue",
    header: () => {
      const t = useTranslations("columns")
      return <div className="text-right">{t("assuranceValue")}</div>
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("assuranceValue"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "location",
    header: () => {
      const t = useTranslations("columns")
      return t("location")
    },
  },
  {
    accessorKey: "sku",
    header: () => {
      const t = useTranslations("columns")
      return t("sku")
    },
  },
  {
    accessorKey: "quantity",
    header: () => {
      const t = useTranslations("columns")
      return <div className="text-right">{t("quantity")}</div>
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("quantity")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const t = useTranslations("actions")
      const item = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
              {t("copyItemId")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/items/${item.id}`}>{t("viewDetails")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/items/${item.id}/edit`}>{t("editItem")}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

