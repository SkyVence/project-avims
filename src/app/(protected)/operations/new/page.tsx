import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import NewOperationPageClient from "./NewOperationPageClient"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t('pages.new.operation.title'),
    description: t('pages.new.operation.description'),
  }
}

export default async function NewOperationPage() {
  // Get authenticated user
  await getAuthenticatedUser()

  // Get items for selection
  const items = await prisma.item.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      image: true,
      category: true,
      family: true,
      subFamily: true,
    },
  })

  // Get packages for selection
  const packages = await prisma.package.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      image: true,
      packageItems: {
        include: {
          item: true,
        },
      },
    },
  })

  // Format the packages to match the expected structure in the client component
  const formattedPackages = packages.map(pkg => ({
    id: pkg.id,
    name: pkg.name,
    description: pkg.description,
    images: pkg.image ? [pkg.image] : [],
    packageItems: pkg.packageItems.map(pi => ({
      itemId: pi.itemId,
      quantity: pi.quantity,
      item: {
        name: pi.item.name,
        value: pi.item.value,
      }
    }))
  }))

  return <NewOperationPageClient items={items} packages={formattedPackages} />
}

