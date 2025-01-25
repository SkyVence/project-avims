import { useTranslations } from "next-intl"
import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

type Package = {
  id: string
  name: string
}

export function PackageSelectionFields({ control, packages }: { control: Control<any>; packages: Package[] }) {
  const t = useTranslations("OperationPackageUI")

  return (
    <FormField
      control={control}
      name="packageIds"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("packages")}</FormLabel>
          <FormControl>
            <Controller
              name="packageIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={packages.map((pkg) => ({ value: pkg.id, label: pkg.name }))}
                  selected={field.value}
                  onChange={field.onChange}
                  placeholder={t("selectPackages")}
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

