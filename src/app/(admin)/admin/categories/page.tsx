import type { Metadata } from "next"
import { CategoriesData } from "./categories-data"

export const metadata: Metadata = {
  title: "Category Management | Admin Dashboard",
  description: "Manage categories, families, and sub-families in the inventory management system",
}

export default function CategoriesPage() {
  return <CategoriesData />
}

