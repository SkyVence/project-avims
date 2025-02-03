"use client"

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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
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
    header: "Brand",
  },
  {
    accessorKey: "families",
    header: "Family",
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
    header: "Sub Family",
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
    header: "Categories",
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
    header: () => <div className="text-right">Value</div>,
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
    header: () => <div className="text-right">Assurance Value</div>,
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("assuranceValue"))
      const formatted = new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(amount)
      return <div className="text-right font-medium">{formatted}</div>
    }
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Quantity</div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("quantity")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>Copy item ID</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/items/${item.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/items/${item.id}/edit`}>Edit item</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

