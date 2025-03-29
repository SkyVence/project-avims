import type { Metadata } from "next"
import { UsersData } from "./users-data"

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users in the inventory management system",
}

export default function UsersPage() {
  return <UsersData />
}

