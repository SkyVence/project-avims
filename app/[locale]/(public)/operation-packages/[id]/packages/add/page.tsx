import { AddPackagesToOperationPackage } from "@/components/OperationPackageInfoUI/AddPackagesToOperationPackage"
import { getOperationPackageById } from "@/lib/dataFetching"

export default async function AddPackagesToOperationPackagePage({ params }: { params: { id: string } }) {
  const operationPackage = await getOperationPackageById(params.id)

  if (!operationPackage) {
    return <div>Operation Package not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <AddPackagesToOperationPackage
        operationPackageId={operationPackage.id}
        operationPackageName={operationPackage.name}
      />
    </div>
  )
}

