import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { useTranslations } from "next-intl"

export function CategoriesFields({
  control,
  categories,
  families,
  subfamilies,
}: {
  control: Control<any>
  categories: any[]
  families: any[]
  subfamilies: any[]
}) {
  const t = useTranslations("CreateUI")
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("CategoriesName")}</FormLabel>
            <FormControl>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={categories || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("CategoriesNamePlaceholder")}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="familyIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("FamilliesName")}</FormLabel>
            <FormControl>
              <Controller
                name="familyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={families || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("FamilliesNamePlaceholder")}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="subfamilyIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('SubFamilliesName')}</FormLabel>
            <FormControl>
              <Controller
                name="subfamilyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={subfamilies || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("SubFamilliesNamePlaceholder")}
                  />
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

