import { PackageDataTable } from "@/components/PackageDataTableUI/package-data-table"
import { columns } from "@/components/PackageDataTableUI/package-columns"
import { getAllPackage } from "@/lib/dataFetching"

export default async function PackagesPage() {
  const packages = await getAllPackage()

  return (
    <div className="container mx-auto py-10">
      <PackageDataTable columns={columns} data={packages} />
    </div>
  )
}

