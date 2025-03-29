import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Create a route matcher for public routes
const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/invitation",
    "/(api|trpc)(.*)",
    "/_next/(.*)",
    "/favicon.ico",
    // Add these patterns to allow server actions
    "/api/(.*)",
    "/_next/server-actions/(.*)"
  ])

export default clerkMiddleware(async (auth, req) => {
  // If the route is public, allow access
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  // If the user is not signed in and trying to access a protected route, redirect to login
  const { userId } = await auth()
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url)
    signInUrl.searchParams.set("redirect_url", req.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

// Stop the middleware from running on static files and api routes
export const config = {
    matcher: [
      "/((?!_next/static|_next/image|favicon.ico|public/|_next/server-actions/).*)",
    ],
  }
