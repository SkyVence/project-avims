"use client"

import { useState, useMemo } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  enableFilters?: boolean
}

type FilterableColumns = "location"

export function PackageDataTable<TData, TValue>({
  columns,
  data,
  enableFilters = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const safeValue = (value: unknown) => {
        if (typeof value === "number") return value.toString()
        if (typeof value === "string") return value.toLowerCase()
        if (value instanceof Date) return value.toISOString()
        return ""
      }

      const getValue = (columnId: string) => {
        return safeValue(row.getValue(columnId))
      }

      const searchableValue = columns
        .filter((column) => typeof column.accessorKey === "string")
        .map((column) => getValue(column.accessorKey as string))
        .join(" ")
        .toLowerCase()

      return searchableValue.includes(filterValue.toLowerCase())
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const uniqueValues = useMemo(() => {
    const values: Record<FilterableColumns, Set<string>> = {
      location: new Set<string>(),
    }

    data.forEach((item: any) => {
      values.location.add(item.location)
    })

    return {
      location: Array.from(values.location),
    }
  }, [data])

  const toggleFilter = (columnId: FilterableColumns, value: string | undefined) => {
    const column = table.getColumn(columnId)
    const currentFilter = column?.getFilterValue() as string | undefined

    if (currentFilter === value) {
      column?.setFilterValue(undefined)
    } else {
      column?.setFilterValue(value)
    }
  }

  const getActiveFilters = () => {
    return (["location"] as const).flatMap((columnId) => {
      const column = table.getColumn(columnId)
      const filterValue = column?.getFilterValue() as string
      return filterValue ? [{ columnId, value: filterValue }] : []
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          {enableFilters && (
            <div className="flex items-center gap-2">
              {(["location"] as const).map((columnId) => (
                <Select
                  key={columnId}
                  onValueChange={(value) => toggleFilter(columnId, value)}
                  value={(table.getColumn(columnId)?.getFilterValue() as string) || ""}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={`Select ${columnId}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueValues[columnId].map((value) => (
                      <SelectItem key={value} value={value}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      {enableFilters && getActiveFilters().length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {getActiveFilters().map(({ columnId, value }) => (
            <button
              key={`${columnId}-${value}`}
              onClick={() => toggleFilter(columnId as FilterableColumns, value)}
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {value}
              <X className="h-4 w-4" />
            </button>
          ))}
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

