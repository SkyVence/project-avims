
import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"

export function BasicInfoFields({ control }: { control: Control<any> }) {
  const t = useTranslations("CreateUI")
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ItemName")}</FormLabel>
            <FormControl>
              <Input placeholder={t("ItemNamePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="brand"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Brand")}</FormLabel>
            <FormControl>
              <Input placeholder={t("BrandPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Value")}</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder={t("ValuePlaceholder")} {...field} />
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
            <FormLabel>{t("Quantity")}</FormLabel>
            <FormControl>
              <Input type="number" placeholder={t("QuantityPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t("Description")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("DescriptionPlaceholder")} className="h-32" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

