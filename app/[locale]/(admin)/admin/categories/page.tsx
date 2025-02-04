import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/forms/category-form"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={categories} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  )
}

