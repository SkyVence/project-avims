import { getItemForPackage } from "@/lib/dataFetching"
import { PackageEditForm } from "@/components/PackageInfoUI/PackageEditForm"

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const package_ = await getItemForPackage(params.id)

  return (
    <div className="container mx-auto py-10">
      <PackageEditForm package_={package_} />
    </div>
  )
}

