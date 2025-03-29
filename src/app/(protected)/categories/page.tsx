import type { Metadata } from "next"
import { getAuthenticatedUser } from "@/lib/auth"
import { CategoriesPreview } from "../../../components/categories/categories-preview"

export const metadata: Metadata = {
  title: "Categories | Inventory Management System",
  description: "Browse categories, families, and sub-families",
}

export default async function CategoriesPage() {
  // Get authenticated user
  await getAuthenticatedUser()

  return <CategoriesPreview />
}

