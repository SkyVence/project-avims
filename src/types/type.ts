export type ItemInput = {
	id: string
	name: string
	description: string | null
	brand: string
	value: number
	insuranceValue: number
	hsCode: string
	location: string
	length: number
	width: number
	height: number
	weight: number
	category: { name: string }
	family: { name: string }
	subFamily: { name: string }
	image: { url: string } | null
	createdAt: Date
}

type PackageItem = {
	id: string
	quantity: number
	item: {
	  id: string
	  name: string
	  brand: string
	  value: number
	  category: { name: string }
	  family: { name: string }
	  subFamily: { name: string }
	  image: { url: string } | null
	}
}

export type PackageInput = {
	id: string
	name: string
	description: string | null
	year: number | null
	location: string | null
	active: boolean
	createdAt: Date
	image: { url: string } | null
	packageItems: PackageItem[]
}

type OperationItem = {
	id: string
	quantity: number
	item: {
		id: string
		name: string
		brand: string
		value: number
		category: { name: string }
		family: { name: string }
		subFamily: { name: string }
		image: { url: string } | null
	}
	package: {
		id: string
		name: string
		description: string | null
		year: number | null
		location: string | null
		active: boolean
		createdAt: Date
		image: { url: string } | null
		packageItems: PackageItem[]
	}
}

export type OperationInput = {
	id: string
	name: string
	description: string | null
	year: number | null
	location: string | null
	active: boolean
	createdAt: Date
	image: { url: string } | null
	operationItems: OperationItem[]
}