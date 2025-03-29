import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getAuthenticatedUser } from "@/lib/auth"

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      try {
        const user = await getAuthenticatedUser()

        // If you throw, the user will not be able to upload
        if (!user) throw new UploadThingError("Unauthorized")

        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id }
      } catch (error) {
        throw new UploadThingError("Unauthorized")
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      if (process.env.NODE_ENV === "development") {
        console.log("Upload complete for userId:", metadata.userId)
        console.log("file url", file.ufsUrl)
        console.log("IMAGE KEY", file.key)
      }
      // Save the image record in the database
      try {
        const { prisma } = await import("@/lib/db")
        await prisma.image.create({
          data: {
            url: file.ufsUrl,
            key: file.key,
          },
        })
      } catch (error) {
        console.error("Error saving image to database:", error)
      }

      return { url: file.ufsUrl, key: file.key }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

