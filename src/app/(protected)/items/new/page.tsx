import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import NewItemPageClient from "./NewItemPageClient"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t('pages.new.item.title'),
    description: t('pages.new.item.description'),
  }
}

export default async function NewItemPage() {
  // Get authenticated user
  await getAuthenticatedUser()

  // Get categories, families, and subfamilies
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const families = await prisma.family.findMany({
    orderBy: {
      name: "asc",
    },
  })

  const subFamilies = await prisma.subFamily.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return <NewItemPageClient categories={categories} families={families} subFamilies={subFamilies} />
}

