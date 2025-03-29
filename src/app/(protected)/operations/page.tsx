import type { Metadata } from "next"
import { OperationsData } from "./operations-data"

export const metadata: Metadata = {
  title: "Operations | Inventory Management System",
  description: "Manage your inventory operations",
}

export default function OperationsPage() {
  return <OperationsData />
}

