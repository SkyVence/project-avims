import { AddItemsToOperationPackage } from "@/components/OperationPackageInfoUI/AddItemsToOperationPackage"
import { getOperationPackageById } from "@/lib/dataFetching"

export default async function AddItemsToOperationPackagePage({ params }: { params: { id: string } }) {
  const operationPackage = await getOperationPackageById(params.id)

  if (!operationPackage) {
    return <div>Operation Package not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <AddItemsToOperationPackage
        operationPackageId={operationPackage.id}
        operationPackageName={operationPackage.name}
      />
    </div>
  )
}

