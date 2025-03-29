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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Shield, User, Search, X } from "lucide-react"
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
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { toast } from "@/hooks/use-toast"
import { deleteUser, toggleUserRole } from "../../app/actions/admin"
import { UserRole } from "@prisma/client"
import { formatDistanceToNow } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

type UserType = {
  id: string
  clerkId: string
  username: string | null
  email: string
  profileImg: string | null
  role: UserRole
  createdAt: Date
}

interface UsersTableProps {
  initialUsers: UserType[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<UserType[]>(initialUsers)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isLoading, setIsLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const t = useTranslations()

  const handleDeleteUser = async (user: UserType) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      setIsLoading(true)
      await deleteUser(userToDelete.id)
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      toast({
        title: t('admin.users.table.actions.delete') + " " + t('common.success'),
        description: t('admin.users.toast.delete.success.description'),
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('admin.users.toast.delete.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleToggleRole = async (id: string, currentRole: UserRole) => {
    try {
      setIsLoading(true)
      const newRole = currentRole === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN
      await toggleUserRole(id, newRole)

      setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)))

      toast({
        title: t('admin.users.toast.role.success.title'),
        description: t('admin.users.toast.role.success.description', { role: newRole.toLowerCase() }),
      })
    } catch (error) {
      console.error(error)
      toast({
        title: t('common.error'),
        description: t('admin.users.toast.role.error.description'),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const columns: ColumnDef<UserType>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t('admin.users.table.columns.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profileImg || undefined} alt={user.username || user.email} />
              <AvatarFallback>
                {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.username || t('admin.users.table.noUsername')}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: t('admin.users.table.columns.role'),
      cell: ({ row }) => {
        const role = row.getValue("role") as UserRole
        return (
          <Badge variant={role === UserRole.ADMIN ? "default" : "outline"} className="capitalize">
            {role === UserRole.ADMIN ? <Shield className="mr-1 h-3 w-3" /> : <User className="mr-1 h-3 w-3" />}
            {t(`admin.users.table.roles.${role.toLowerCase()}`)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t('admin.users.table.columns.lastActive')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div className="text-sm">{formatDistanceToNow(date, { addSuffix: true })}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t('common.actions')}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)} disabled={isLoading}>
                {user.role === UserRole.ADMIN ? (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('admin.users.table.actions.removeAdmin')}</span>
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>{t('admin.users.table.actions.makeAdmin')}</span>
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user)}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                {t('admin.users.table.actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
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

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : users

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('admin.users.title')}</CardTitle>
        <CardDescription>{t('admin.users.description')}</CardDescription>
        <div className="flex items-center gap-2 pt-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('admin.users.table.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('admin.users.table.empty')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.users.table.actions.delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.users.table.deleteConfirmation', { name: userToDelete?.username || userToDelete?.email || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                confirmDelete()
              }}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? t('common.loading') : t('admin.users.table.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

