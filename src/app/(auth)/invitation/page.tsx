import { redirect } from "next/navigation"
import { SignUpForm } from "../../../components/auth/sign-up-form"

export default function InvitationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Check if there's an invitation token in the URL
  const token = searchParams.__clerk_ticket as string | undefined

  // If there's no token, redirect to login
  if (!token) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">Create your account</h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          You've been invited to join. Please create your account below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <SignUpForm invitationToken={token} />
        </div>
      </div>
    </div>
  )
}

