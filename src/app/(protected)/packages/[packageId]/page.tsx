import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import { PackageDetail } from "@/components/packages/package-details"

interface PackagePageProps {
  params: {
    packageId: string
  }
}

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { packageId } = await params
  const packageData = await prisma.package.findUnique({
    where: { id: packageId },
  })

  if (!packageData) {
    return {
      title: "Package Not Found | Inventory Management System",
    }
  }

  return {
    title: `${packageData.name} | Packages | Inventory Management System`,
    description: `Browse ${packageData.name} package details`,
  }
}

export default async function PackagePage({ params }: PackagePageProps) {
  await getAuthenticatedUser()
  const { packageId } = await params

  const packageData = await prisma.package.findUnique({
    where: { id: packageId },
    include: {
      image: {
        select: {
          url: true,
          key: true,
        },
      },
      packageItems: {
        include: {
          item: {
            include: {
              category: {
                select: { name: true },
              },
              family: {
                select: { name: true },
              },
              subFamily: {
                select: { name: true },
              },
              image: {
                select: { url: true },
              },
            },
          },
        },
      },
    },
  })

  if (process.env.NODE_ENV === "development") {
    console.log(packageData)
  }

  if (!packageData) {
    notFound()
  }

  return <PackageDetail packageData={packageData} />
}

