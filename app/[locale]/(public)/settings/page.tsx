import { UserSettingsForm } from "@/components/UserSettingsForm"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <UserSettingsForm user={user} />
    </div>
  )
}

