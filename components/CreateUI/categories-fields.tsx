import { type Control, Controller } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"

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
  return (
    <div className="grid grid-cols-1 gap-4">
      <FormField
        control={control}
        name="categoryIds"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Categories</FormLabel>
            <FormControl>
              <Controller
                name="categoryIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={categories || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select categories"
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
            <FormLabel>Families</FormLabel>
            <FormControl>
              <Controller
                name="familyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={families || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select families"
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
            <FormLabel>Subfamilies</FormLabel>
            <FormControl>
              <Controller
                name="subfamilyIds"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={subfamilies || []}
                    selected={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select subfamilies"
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

