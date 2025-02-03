import { useTranslations } from "next-intl"
import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

type Category = {
  id: string
  name: string
}

type Family = {
  id: string
  name: string
}

type Subfamily = {
  id: string
  name: string
}

export function CategoriesFields({
  control,
  categories,
  families,
  subfamilies,
}: {
  control: Control<any>
  categories: Category[]
  families: Family[]
  subfamilies: Subfamily[]
}) {
  const t = useTranslations("EditItemUI")

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("categories")}</FormLabel>
            <FormControl>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={categories.map((category) => ({ value: category.id, label: category.name }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("selectCategories")}
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
            <FormLabel>{t("families")}</FormLabel>
            <FormControl>
              <Controller
                name="familyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={families.map((family) => ({ value: family.id, label: family.name }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("selectFamilies")}
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
            <FormLabel>{t("subfamilies")}</FormLabel>
            <FormControl>
              <Controller
                name="subfamilyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={subfamilies.map((subfamily) => ({ value: subfamily.id, label: subfamily.name }))}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder={t("selectSubfamilies")}
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

