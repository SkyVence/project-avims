import type { Metadata } from "next"
import { PackagesData } from "./packages-data"

export const metadata: Metadata = {
  title: "Packages | Inventory Management System",
  description: "Manage your inventory packages",
}

export default function PackagesPage() {
  return <PackagesData />
}

