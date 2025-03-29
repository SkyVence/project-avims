"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { 
  ArrowUpDown, 
  Check, 
  ChevronDown, 
  FileText, 
  Pencil, 
  MoreHorizontal, 
  Trash2, 
  X,
  Package,
  Layers,
  ShoppingBag
} from "lucide-react"

import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { deleteOperation } from "../../app/actions/operation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

type Operation = {
  id: string
  name: string
  description: string | null
  year: number | null
  location: string | null
  active: boolean
  // Add count information
  _count?: {
    operationItems: number
  }
  // Add detailed counts
  _counts?: {
    items: number
    packages: number
    total: number
  }
}

interface OperationsTableProps {
  initialOperations: Operation[]
}

export function OperationsTable({ initialOperations }: OperationsTableProps) {
  const router = useRouter()
  const [operations, setOperations] = useState<Operation[]>(initialOperations)
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: false }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [operationToDelete, setOperationToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true)
      await deleteOperation(id)
      setOperations(operations.filter((op) => op.id !== id))
      toast({
        title: "Operation deleted",
        description: "The operation has been deleted successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to delete operation.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setOperationToDelete(null)
    }
  }

  const columns: ColumnDef<Operation>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            className="pl-0 font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            className="font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Year
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("year") || "—"}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("location") || "—"}</div>,
    },
    {
      accessorKey: "_counts.items",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            className="font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Items
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.original._counts?.items || 0
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  <span>{count}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{count} individual item{count !== 1 ? "s" : ""}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "_counts.packages",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            className="font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Packages
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.original._counts?.packages || 0
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{count}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{count} package{count !== 1 ? "s" : ""}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "_counts.total",
      header: ({ column }) => {
        return (
          <Button 
            variant="ghost" 
            className="font-medium"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const count = row.original._counts?.total || 0
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span>{count}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{count} total component{count !== 1 ? "s" : ""}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("active")
        return (
          <Badge variant={isActive ? "default" : "secondary"} className="flex w-fit items-center gap-1">
            {isActive ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
            <span>{isActive ? "Active" : "Inactive"}</span>
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const operation = row.original

        return (
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push(`/operations/${operation.id}`)}
              title="View details"
            >
              <FileText className="h-4 w-4" />
              <span className="sr-only">View</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.push(`/operations/${operation.id}/edit`)}
              title="Edit operation"
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <AlertDialog open={operationToDelete === operation.id} onOpenChange={(isOpen) => {
              if (!isOpen) setOperationToDelete(null)
            }}>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setOperationToDelete(operation.id)}
                  title="Delete operation"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                  <span className="sr-only">Delete</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Operation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this operation? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault()
                      handleDelete(operation.id)
                    }}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: operations,
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Filter operations..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => router.push(`/operations/${row.original.id}`)}
                >
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
                  No operations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {operations.length} operations
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
} 