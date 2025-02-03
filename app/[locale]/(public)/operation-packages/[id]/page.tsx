import { OperationPackageInfo } from "@/components/OperationPackageInfoUI/OperationPackageInfo"
import { getOperationPackageById } from "@/lib/dataFetching"

export default async function OperationPackagePage({ params }: { params: { id: string } }) {
  const operationPackage = await getOperationPackageById(params.id)

  if (!operationPackage) {
    return <div>Operation Package not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <OperationPackageInfo operationPackage={operationPackage} />
    </div>
  )
}

