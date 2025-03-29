import { Separator } from "@radix-ui/react-separator";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import Image from "next/image";
import { Package2 } from "lucide-react";
import { useTranslations } from "next-intl";

type Item = {
  id: string;
  name: string;
  description: string | null;
  brand: string;
  value: number;
  insuranceValue: number;
  hsCode: string;
  location: string;
  length: number;
  width: number;
  height: number;
  category: { name: string };
  family: { name: string };
  subFamily: { name: string };
  quantity: number;
  image: { url: string } | null;
  createdAt: Date;
};

interface ItemDetailProps {
  item: Item;
}

export function ItemDetail({ item }: ItemDetailProps) {
  const t = useTranslations();
  const volume = item.length * item.width * item.height;
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        {/* Image Section */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{t('details.item.image')}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {item.image ? (
              <div className="relative w-full aspect-square rounded-md overflow-hidden">
                <Image src={item.image.url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
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
            <CardTitle>{t('details.item.basicInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{item.name}</h2>
              <p className="text-muted-foreground">{t('details.common.id')}: {item.id}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{item.category.name}</Badge>
              <Badge variant="outline">{item.family.name}</Badge>
              <Badge variant="outline">{item.subFamily.name}</Badge>
            </div>

            {item.description && (
              <div>
                <h3 className="font-medium">{t('details.common.description')}</h3>
                <p>{item.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">{t('details.item.basicInfo.brand')}</h3>
                <p>{item.brand}</p>
              </div>

              <div>
                <h3 className="font-medium">{t('details.item.basicInfo.location')}</h3>
                <p>{item.location}</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.item.basicInfo.hsCode')}</h3>
                <p>{item.hsCode}</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.common.created')}</h3>
                <p>{item.createdAt.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('details.item.financial.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">{t('details.item.financial.value')}</h3>
                <p className="text-xl font-bold">{item.value.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.item.financial.insuranceValue')}</h3>
                <p className="text-xl font-bold">
                  {item.insuranceValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-medium">{t('details.item.financial.quantity')}</h3>
              <p className="text-xl font-bold">{item.quantity}</p>
            </div>
          </CardContent>
        </Card>

        {/* Dimensions */}
        <Card>
          <CardHeader>
            <CardTitle>{t('details.item.dimensions.title')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium">{t('details.item.dimensions.length')}</h3>
                <p>{item.length} {t('details.item.dimensions.units.length')}</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.item.dimensions.width')}</h3>
                <p>{item.width} {t('details.item.dimensions.units.length')}</p>
              </div>
              <div>
                <h3 className="font-medium">{t('details.item.dimensions.height')}</h3>
                <p>{item.height} {t('details.item.dimensions.units.length')}</p>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium">{t('details.item.dimensions.volume')}</h3>
              <p>{volume} {t('details.item.dimensions.units.volume')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
