import { useTranslations } from "next-intl"
import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

type Item = {
  id: string
  name: string
  sku: string
}

export function ItemSelectionFields({ control, items }: { control: Control<any>; items: Item[] }) {
  const t = useTranslations("PackageUI")

  return (
    <FormField
      control={control}
      name="itemIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("items")}</FormLabel>
          <FormControl>
            <Controller
              name="itemIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={items.map((item) => ({ value: item.id, label: `${item.name} (${t("sku")}: ${item.sku})` }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectItems")}
                />
              )}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

