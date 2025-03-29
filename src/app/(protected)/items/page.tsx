import type { Metadata } from "next"
import { ItemsData } from "./items-data"

export const metadata: Metadata = {
  title: "Items | Inventory Management System",
  description: "Manage your inventory items",
}

export default function ItemsPage() {
  return <ItemsData />
}

