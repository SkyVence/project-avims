"use client"

import { useTranslations } from "next-intl"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"

export type OperationPackage = {
  id: string
  name: string
  location: string
  year: string
  createdAt: string
  updatedAt: string
}

export const columns: ColumnDef<OperationPackage>[] = [
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
        <Link href={`/operation-packages/${row.original.id}`} className="hover:underline">
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
    accessorKey: "year",
    header: () => {
      const t = useTranslations("columns")
      return t("year")
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
      const operationPackage = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(operationPackage.id)}>
              {t("copyOperationPackageId")}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/operation-packages/${operationPackage.id}`}>{t("viewDetails")}</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/operation-packages/${operationPackage.id}/edit`}>{t("editOperationPackage")}</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

