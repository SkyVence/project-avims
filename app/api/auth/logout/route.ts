import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    (await cookies()).delete("token")
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

