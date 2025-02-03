import { getItemForPackage } from "@/lib/dataFetching"
import { AddItemsToPackage } from "@/components/PackageInfoUI/AddItemsToPackage"

export default async function AddItemsToPackagePage({ params }: { params: { id: string } }) {
  const package_ = await getItemForPackage(params.id)

  if (!package_) {
    return <div>Package not found</div>
  }

  return (
    <div className="container mx-auto py-10">
      <AddItemsToPackage packageId={package_.id} packageName={package_.name} />
    </div>
  )
}

