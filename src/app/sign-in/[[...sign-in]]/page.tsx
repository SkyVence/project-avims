import type { Metadata } from "next"
import { UserAuthForm } from "../../../components/sign-in/user-auth-form"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default function SignInPage() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[350px]">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  )
}

