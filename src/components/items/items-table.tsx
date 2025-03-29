"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { useRouter } from "next/navigation"
import { deleteItem } from "../../app/actions/item"
import { toast } from "@/hooks/use-toast"

type Item = {
  id: string
  name: string
  description: string | null
  brand: string | null
  location: string | null
  category: {name: string} | null
  family: {name: string} | null
  subFamily: {name: string} | null
  quantity: number | null
}

interface ItemsTableProps {
  initialItems: Item[]
}

export function ItemsTable({ initialItems }: ItemsTableProps) {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>(initialItems)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isDeleting, setIsDeleting] = useState(false)
  const t = useTranslations()

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteItem(id)
      setItems(items.filter((item) => item.id !== id))
      toast({
        title: t('items.table.toast.delete.success.title'),
        description: t('items.table.toast.delete.success.description'),
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('items.table.toast.delete.error.title'),
        description: t('items.table.toast.delete.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t('items.table.columns.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "brand",
      header: t('items.table.columns.brand'),
      cell: ({ row }) => <div>{row.getValue("brand") || "-"}</div>,
    },
    {
      accessorFn: (row) => row.category?.name || null,
      id: "category",
      header: t('items.table.columns.category'),
      cell: ({ row }) => <div>{row.getValue("category") || "-"}</div>,
    },
    {
      accessorFn: (row) => row.family?.name || null, 
      id: "family",
      header: t('items.table.columns.family'),
      cell: ({ row }) => <div>{row.getValue("family") || "-"}</div>
    },
    {
      accessorFn: (row) => row.subFamily?.name || null,
      id: "subFamily",
      header: t('items.table.columns.subFamily'),
      cell: ({ row }) => <div>{row.getValue("subFamily") || "-"}</div>
    },
    {
      accessorKey: "location",
      header: t('items.table.columns.location'),
      cell: ({ row }) => <div>{row.getValue("location") || "-"}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t('items.table.columns.quantity')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('items.table.actions.title')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('items.table.actions.title')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => router.push(`/items/${item.id}`)}>{t('items.table.actions.view')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/items/${item.id}/edit`)}>{t('items.table.actions.edit')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(item.id)}
                disabled={isDeleting}
              >
                {t('items.table.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t('items.table.filter.byName')}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('items.table.filter.columns')} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {t(`items.table.columns.${column.id}`)}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t('items.table.empty')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length === 1 
            ? t('items.table.pagination.itemCount.singular')
            : t('items.table.pagination.itemCount.plural', { count: table.getFilteredRowModel().rows.length })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('items.table.pagination.previous')}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
          >
            {t('items.table.pagination.next')}
          </Button>
        </div>
      </div>
    </div>
  )
}

