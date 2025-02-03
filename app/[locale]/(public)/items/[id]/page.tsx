import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ItemInfo } from "@/components/ItemInfoUI/ItemInfo"

async function getItem(id: string) {
  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      category: true,
      families: true,
      subfamilies: true,
    },
  })

  if (!item) {
    notFound()
  }

  return item
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id)
  
  return <ItemInfo item={item}/>
}
