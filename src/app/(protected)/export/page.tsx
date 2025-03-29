import type { Metadata } from "next"
import { ExportData } from "./export-data"

export const metadata: Metadata = {
  title: "Export Data | Inventory Management System",
  description: "Export operations and packages to Excel or CSV files",
}

export default function ExportPage() {
  return <ExportData />
} 