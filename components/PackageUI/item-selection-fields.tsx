"use client"

import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

type Item = {
  id: string
  name: string
  sku: string
}

interface ItemSelectionFieldsProps {
  items: Item[]
}

export function ItemSelectionFields({ items }: ItemSelectionFieldsProps) {
  const t = useTranslations("PackageUI")
  const { control } = useFormContext()

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="itemIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("items")}</FormLabel>
            <FormControl>
              <MultiSelect
                options={items.map((item) => ({
                  value: item.id,
                  label: `${item.name} (${t("sku")}: ${item.sku})`,
                }))}
                selected={field.value}
                onChange={field.onChange}
                placeholder={t("selectItems")}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

