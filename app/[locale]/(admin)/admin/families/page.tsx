import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { FamilyForm } from "@/components/forms/family-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function FamiliesPage() {
  const families = await prisma.family.findMany()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Families</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Family</CardTitle>
        </CardHeader>
        <CardContent>
          <FamilyForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Families List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={families} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  )
}

