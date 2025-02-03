import { PackageInfo } from "@/components/PackageInfoUI/PackageInfo"
import { getItemForPackage } from "@/lib/dataFetching"


export default async function ItemPage({ params }: { params: { id: string } }) {
  const package_ = await getItemForPackage(params.id)

  return <PackageInfo package_={package_} />
}
