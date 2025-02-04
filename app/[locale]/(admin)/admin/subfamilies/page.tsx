import { prisma } from "@/lib/prisma"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { SubFamilyForm } from "@/components/forms/subfamily-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SubfamiliesPage() {
  const subfamilies = await prisma.subFamily.findMany()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Subfamilies</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add New Subfamily</CardTitle>
        </CardHeader>
        <CardContent>
          <SubFamilyForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Subfamilies List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={subfamilies} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  )
}

