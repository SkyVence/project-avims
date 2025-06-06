import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"
import { Metadata } from "next"
import React from "react"
import { CreateOperationPackageForm } from "@/components/OperationPackageUI/create-operation-package-form"

export const metadata: Metadata = { title: "AVIMS - Create Item" }

export default async function CreateItemPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex justify-center">
        <CreateOperationPackageForm />
    </div>
)}

