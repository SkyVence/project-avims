import type { Metadata } from "next"
import { ImportData } from "./import-data"

export const metadata: Metadata = {
  title: "Import Items | Inventory Management System",
  description: "Import items from Excel or CSV files",
}

export default function ImportPage() {
  return <ImportData />
} 