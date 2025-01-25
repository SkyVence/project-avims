import { useTranslations } from "next-intl"
import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function DetailsFields({ control }: { control: Control<any> }) {
  const t = useTranslations("EditItemUI")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("location")}</FormLabel>
            <FormControl>
              <Input placeholder={t("itemLocationPlaceholder")} {...field} />
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
            <FormLabel>{t("sku")}</FormLabel>
            <FormControl>
              <Input placeholder={t("itemSkuPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="quantity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("quantity")}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t("itemQuantityPlaceholder")} {...field} />
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
            <FormLabel>{t("origin")}</FormLabel>
            <FormControl>
              <Input placeholder={t("itemOriginPlaceholder")} {...field} />
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
            <FormLabel>{t("assuranceValue")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("itemAssuranceValuePlaceholder")} {...field} />
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
            <FormLabel>{t("dateOfPurchase")}</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
            <FormLabel>{t("length")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("itemLengthPlaceholder")} {...field} />
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
            <FormLabel>{t("width")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("itemWidthPlaceholder")} {...field} />
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
            <FormLabel>{t("height")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("itemHeightPlaceholder")} {...field} />
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
            <FormLabel>{t("weight")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("itemWeightPlaceholder")} {...field} />
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
            <FormLabel>{t("hsCode")}</FormLabel>
            <FormControl>
              <Input placeholder={t("itemHsCodePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

