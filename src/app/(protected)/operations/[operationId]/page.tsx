import type { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import { OperationDetail } from "@/components/operations/operation-details"

interface OperationPageProps {
  params: {
    operationId: string
  }
}

export async function generateMetadata({ params }: OperationPageProps): Promise<Metadata> {
  const operationId = params.operationId
  const operation = await prisma.operation.findUnique({
    where: { id: operationId },
  })

  if (!operation) {
    return {
      title: "Operation Not Found | Inventory Management System",
    }
  }

  return {
    title: `${operation.name} | Operations | Inventory Management System`,
    description: `View details for ${operation.name} operation`,
  }
}

export default async function OperationPage({ params }: OperationPageProps) {
  await getAuthenticatedUser()
  const operationId = params.operationId

  const operation = await prisma.operation.findUnique({
    where: { id: operationId },
    include: {
      image: {
        select: {
          url: true,
          key: true,
        },
      },
      operationItems: {
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
          package: {
            include: {
              image: {
                select: { url: true },
              },
              packageItems: {
                include: {
                  item: {
                    select: {
                      name: true,
                      value: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (process.env.NODE_ENV === "development") {
    console.log(operation)
  }

  if (!operation) {
    notFound()
  }

  // Map to the expected shape with image array for component
  const mappedOperation = {
    ...operation,
    image: operation.image ? [operation.image] : [],
  }

  return <OperationDetail operation={mappedOperation} />
}

