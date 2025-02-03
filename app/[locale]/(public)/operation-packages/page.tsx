import { OperationPackageDataTable } from "@/components/OperationDataTableUI/operation-package-data-table"
import { columns } from "@/components/OperationDataTableUI/operation-package-columns"
import { getAllOperationPackage } from "@/lib/dataFetching"

export default async function OperationPackagesPage() {
  const operationPackages = await getAllOperationPackage()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Operation Packages</h1>
      <OperationPackageDataTable columns={columns} data={operationPackages} />
    </div>
  )
}

