import { redirect } from "@/i18n/routing"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log("No session, redirecting to login...")
    redirect({href: '/login', locale: 'fr'})
  }

  console.log("Session found, redirecting to dashboard...")
  redirect({href: '/dashboard', locale: 'fr'})
}

