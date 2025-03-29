import { Metadata } from "next"
import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/auth"
import { notFound } from "next/navigation"
import ItemDetails from "@/components/ui-v2/item-detail"

interface ItemPageProps {
	params: {
		itemId: string
	}
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
	const { itemId } = await params
	const item = await prisma.item.findUnique({
		where: { id: itemId }
	})

	if (!item) {
		return {
			title: "Item Not Found | Inventory Management System",
		}
	}

	return {
		title: `${item.name} | Items | Inventory Management System`,
		description: `Browse ${item.name} item details`,
	}
}

export default async function ItemPage({ params }: ItemPageProps) {
	await getAuthenticatedUser()
	const { itemId } = await params

	const item = await prisma.item.findUnique({
		where: { id: itemId },
		include: {
			category: {
				select: {
					name: true
				}
			},
			subFamily: {
				select: {
					name: true
				},
			},
			family: {
				select: {
					name: true
				},
			},
			image: {
				select: {
					url: true
				}
			}
		}
	})
	if (process.env.NODE_ENV === "development") {
		console.log(item)
	}

	if (!item) {
		notFound()
	}

	return <ItemDetails item={item}/>
}