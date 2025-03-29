import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import Image from "next/image"
import { Package2, Box, Calendar, MapPin, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

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

type Package = {
  id: string
  name: string
  description: string | null
  year: number | null
  location: string | null
  active: boolean
  image: { url: string; key: string } | null
  packageItems: PackageItem[]
  createdAt: Date
}

interface PackageDetailProps {
  packageData: Package
}

export function PackageDetail({ packageData }: PackageDetailProps) {
  const t = useTranslations()
  
  // Calculate total value of all items in the package
  const totalValue = packageData.packageItems.reduce((sum, item) => sum + item.item.value * item.quantity, 0)

  // Calculate total number of items
  const totalItems = packageData.packageItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Image Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('details.package.image')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {packageData.image ? (
              <div className="relative w-full aspect-square rounded-md overflow-hidden">
                <Image
                  src={packageData.image.url}
                  alt={packageData.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-muted rounded-md flex items-center justify-center">
                <Package2 className="h-24 w-24 text-muted-foreground" />
                <span className="sr-only">{t('details.common.noImage')}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('details.package.basicInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{packageData.name}</h2>
                <p className="text-muted-foreground">{t('details.common.id')}: {packageData.id}</p>
              </div>
              <Badge variant={packageData.active ? "default" : "destructive"}>
                {packageData.active ? t('details.package.status.active') : t('details.package.status.inactive')}
              </Badge>
            </div>

            {packageData.description && (
              <div>
                <h3 className="font-medium">{t('details.common.description')}</h3>
                <p>{packageData.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {packageData.year && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{t('details.package.basicInfo.year')}</h3>
                    <p>{packageData.year}</p>
                  </div>
                </div>
              )}

              {packageData.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{t('details.package.basicInfo.location')}</h3>
                    <p>{packageData.location}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium">{t('details.common.created')}</h3>
                <p>{packageData.createdAt.toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-medium">{t('details.common.status')}</h3>
                <div className="flex items-center gap-1">
                  {packageData.active ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{t('details.package.status.active')}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span>{t('details.package.status.inactive')}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('details.package.summary.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">{t('details.package.summary.totalValue')}</h3>
                <p className="text-xl font-bold">{totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.package.summary.totalItems')}</h3>
                <p className="text-xl font-bold">{totalItems}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">{t('details.package.summary.uniqueItems')}</h3>
              <p className="text-xl font-bold">{packageData.packageItems.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('common.actions')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Button asChild className="flex-1">
                <Link href={`/packages/${packageData.id}/edit`}>{t('details.package.buttons.editPackage')}</Link>
              </Button>
              <Button variant="outline" className="flex-1">
                <Link href="/packages">{t('details.package.buttons.backToPackages')}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Package Items */}
      <Card>
        <CardHeader>
          <CardTitle>{t('details.package.items.title')} ({packageData.packageItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {packageData.packageItems.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">{t('details.package.items.empty')}</div>
          ) : (
            <div className="grid gap-4">
              {packageData.packageItems.map((packageItem) => (
                <div key={packageItem.id} className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="md:w-24 h-24 relative flex-shrink-0">
                      {packageItem.item.image ? (
                        <Image
                          src={packageItem.item.image.url || "/placeholder.svg"}
                          alt={packageItem.item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                          <Box className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="font-medium">
                            <Link href={`/items/${packageItem.item.id}`} className="hover:underline">
                              {packageItem.item.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">{packageItem.item.brand}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{packageItem.item.category.name}</Badge>
                          <Badge variant="outline">{packageItem.item.family.name}</Badge>
                          <Badge variant="outline">{packageItem.item.subFamily.name}</Badge>
                        </div>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{t('details.package.items.quantity')}: </span>
                          <span className="font-bold">{packageItem.quantity}</span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">{t('details.package.items.value')}: </span>
                          <span className="font-bold">
                            {(packageItem.item.value * packageItem.quantity).toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                            })}
                            €
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

