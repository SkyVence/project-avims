import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"

export function DetailsFields({ control }: { control: Control<any> }) {
  const t = useTranslations("CreateUI")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Location")}</FormLabel>
            <FormControl>
              <Input placeholder={t("LocationPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="sku"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("SKU")}</FormLabel>
            <FormControl>
              <Input placeholder={t("SKUPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="origin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Origin")}</FormLabel>
            <FormControl>
              <Input placeholder={t("OriginPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="assuranceValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("InsuranceValue")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("InsuranceValuePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="dateOfPurchase"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("DateOfPurchase")}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hsCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('HsCode')}</FormLabel>
            <FormControl>
              <Input placeholder={t("HsCodePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Length")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("LengthPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="width"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Width")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t('WidthPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('Height')}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t('HeightPlaceholder')} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('Weight')}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("WeightPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

