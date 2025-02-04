import { prisma } from "@/lib/prisma"

export async function calculatePackageTotalValue(packageId: string): Promise<number> {
  const package_ = await prisma.package.findUnique({
    where: { id: packageId },
    include: { items: true },
  })

  if (!package_) {
    throw new Error("Package not found")
  }

  const totalValue = package_.items.reduce((sum, item) => sum + item.value, 0)
  return totalValue
}

