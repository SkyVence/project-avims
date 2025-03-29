import type React from "react"
import { ThemeProvider } from "../../components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`min-h-screen bg-background ${inter.className}`}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </ThemeProvider>
    </div>
  )
}

