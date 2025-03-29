import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import NewPackagePageClient from "./NewPackagePageClient"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t('pages.new.package.title'),
    description: t('pages.new.package.description'),
  }
}

export default async function NewPackagePage() {
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

  return <NewPackagePageClient items={items} />
}

