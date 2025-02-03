import { OperationPackageEditForm } from "@/components/OperationPackageInfoUI/OperationPackageEditForm"
import { getOperationPackageById } from "@/lib/dataFetching"

export default async function EditOperationPackagePage({ params }: { params: { id: string } }) {
  const operationPackage = await getOperationPackageById(params.id)

  return (
    <div className="container mx-auto py-10">
      <OperationPackageEditForm operationPackage={operationPackage} />
    </div>
  )
}

