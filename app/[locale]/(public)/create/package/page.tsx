import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import type { Metadata } from "next"
import { CreatePackageForm } from "@/components/PackageUI/create-package-form"

export const metadata: Metadata = { title: "AVIMS - Create Package" }

export default async function CreatePackagePage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  return (
    <main className="container mx-auto p-4">
      <CreatePackageForm />
    </main>
  )
}

