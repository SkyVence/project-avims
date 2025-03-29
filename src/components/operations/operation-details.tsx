import Link from "next/link"
import Image from "next/image"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Briefcase, CalendarIcon, FileEdit, FilePlus, FileText, Map, Package, Scroll, ShoppingBag } from "lucide-react"
import { useTranslations } from "next-intl"

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
  } | null
  package: {
    id: string
    name: string
    image: { url: string } | null
    packageItems: {
      itemId: string
      quantity: number
      item: {
        name: string
        value: number
      }
    }[]
  } | null
}

type Operation = {
  id: string
  name: string
  description: string | null
  year: number | null
  location: string | null
  active: boolean
  image: { url: string; key: string }[]
  operationItems: OperationItem[]
  createdAt: Date
}

interface OperationDetailProps {
  operation: Operation
}

export function OperationDetail({ operation }: OperationDetailProps) {
  const t = useTranslations()
  
  // Count items and packages
  const itemCount = operation.operationItems.filter((oi) => oi.item).length
  const packageCount = operation.operationItems.filter((oi) => oi.package).length

  // Calculate total value
  const totalValue = operation.operationItems.reduce((sum, oi) => {
    if (oi.item) {
      return sum + oi.item.value * oi.quantity
    } else if (oi.package) {
      // Sum up the value of all items in the package
      const packageValue = oi.package.packageItems.reduce(
        (packageSum, pi) => packageSum + pi.item.value * pi.quantity,
        0,
      )
      return sum + packageValue * oi.quantity
    }
    return sum
  }, 0)

  return (
    <div className="container mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{operation.name}</h1>
          <p className="text-muted-foreground">{t('details.common.id')}: {operation.id}</p>
        </div>
        <Badge variant={operation.active ? "default" : "secondary"} className="px-3 py-1 text-sm">
          {operation.active ? t('details.operation.status.active') : t('details.operation.status.inactive')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Image Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t('details.operation.image')}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center p-4">
            {operation.image.length > 0 ? (
              <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                <Image
                  src={operation.image[0].url}
                  alt={operation.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-md border-2 border-dashed">
                <Briefcase className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="flex w-full flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/operations/${operation.id}/edit`}>
                  <FileEdit className="mr-2 h-4 w-4" />
                  {t('details.operation.buttons.editOperation')}
                </Link>
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/operations">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {t('details.operation.buttons.allOperations')}
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Operation Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scroll className="h-5 w-5" />
              {t('details.operation.basicInfo.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {operation.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">{t('details.common.description')}</h3>
                <p className="mt-1">{operation.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {operation.year && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('details.operation.basicInfo.year')}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{operation.year}</span>
                  </div>
                </div>
              )}

              {operation.location && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">{t('details.operation.basicInfo.location')}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <Map className="h-4 w-4 text-muted-foreground" />
                    <span>{operation.location}</span>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">{t('details.operation.summary.title')}</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-primary" />
                      <h3 className="mt-2 text-xl font-bold">{itemCount}</h3>
                      <p className="text-sm text-muted-foreground">{t('details.operation.summary.items')}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Package className="mx-auto h-8 w-8 text-primary" />
                      <h3 className="mt-2 text-xl font-bold">{packageCount}</h3>
                      <p className="text-sm text-muted-foreground">{t('details.operation.summary.packages')}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold">
                        {totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
                      </h3>
                      <p className="text-sm text-muted-foreground">{t('details.operation.summary.totalValue')}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operation Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            {t('details.operation.components.title')} ({operation.operationItems.length})
          </CardTitle>
          <CardDescription>
            {t('details.operation.components.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">{t('details.operation.components.tabs.all')} ({operation.operationItems.length})</TabsTrigger>
              <TabsTrigger value="items">{t('details.operation.components.tabs.items')} ({itemCount})</TabsTrigger>
              <TabsTrigger value="packages">{t('details.operation.components.tabs.packages')} ({packageCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              {operation.operationItems.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">{t('details.operation.components.empty.title')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('details.operation.components.empty.description')}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href={`/operations/${operation.id}/edit`}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      {t('details.operation.components.empty.addButton')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {operation.operationItems.map((operationItem) => (
                    <OperationItemCard key={operationItem.id} operationItem={operationItem} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="items" className="mt-4">
              {itemCount === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">{t('details.operation.components.empty.itemsTitle')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('details.operation.components.empty.itemsDescription')}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href={`/operations/${operation.id}/edit`}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      {t('details.operation.components.empty.addButton')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {operation.operationItems
                    .filter((operationItem) => operationItem.item)
                    .map((operationItem) => (
                      <OperationItemCard key={operationItem.id} operationItem={operationItem} />
                    ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="packages" className="mt-4">
              {packageCount === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">{t('details.operation.components.empty.packagesTitle')}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t('details.operation.components.empty.packagesDescription')}
                  </p>
                  <Button asChild className="mt-4">
                    <Link href={`/operations/${operation.id}/edit`}>
                      <FilePlus className="mr-2 h-4 w-4" />
                      {t('details.operation.components.empty.addButton')}
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {operation.operationItems
                    .filter((operationItem) => operationItem.package)
                    .map((operationItem) => (
                      <OperationItemCard key={operationItem.id} operationItem={operationItem} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function OperationItemCard({ operationItem }: { operationItem: OperationItem }) {
  const t = useTranslations()
  
  if (operationItem.item) {
    const item = operationItem.item
    
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {item.image ? (
            <Image
              src={item.image.url}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {item.category.name}
            </Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base">{item.name}</CardTitle>
              <CardDescription>{item.brand}</CardDescription>
            </div>
            <Badge variant="outline" className="whitespace-nowrap">
              x{operationItem.quantity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {item.family.name} / {item.subFamily.name}
            </div>
            <div className="font-medium">
              {(item.value * operationItem.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-3 py-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={`/items/${item.id}`}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              {t('details.operation.itemCard.viewDetails')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (operationItem.package) {
    const pkg = operationItem.package
    const itemCount = pkg.packageItems.length
    
    // Calculate package value
    const packageValue = pkg.packageItems.reduce(
      (sum, pi) => sum + pi.item.value * pi.quantity,
      0
    )
    
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {pkg.image ? (
            <Image
              src={pkg.image.url}
              alt={pkg.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          <div className="absolute right-2 top-2">
            <Badge className="bg-primary text-primary-foreground">{t('details.operation.packageCard.package')}</Badge>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{pkg.name}</CardTitle>
            <Badge variant="outline" className="whitespace-nowrap">
              x{operationItem.quantity}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? t('details.operation.itemCard.items') : t('details.operation.itemCard.items_plural')}
            </div>
            <div className="font-medium">
              {(packageValue * operationItem.quantity).toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-3 py-2">
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href={`/packages/${pkg.id}`}>
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              {t('details.operation.packageCard.viewDetails')}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return null
} 