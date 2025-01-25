import { useTranslations } from "next-intl"
import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function BasicInfoFields({ control }: { control: Control<any> }) {
  const t = useTranslations("OperationPackageUI")

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}</FormLabel>
            <FormControl>
              <Input placeholder={t("operationPackageNamePlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("location")}</FormLabel>
            <FormControl>
              <Input placeholder={t("operationPackageLocationPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="year"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("year")}</FormLabel>
            <FormControl>
              <Input placeholder={t("operationPackageYearPlaceholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

