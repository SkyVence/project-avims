import type { Control } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

export function DetailsFields({ control }: { control: Control<any> }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="Item location" {...field} />
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
            <FormLabel>SKU</FormLabel>
            <FormControl>
              <Input placeholder="Item SKU" {...field} />
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
            <FormLabel>Origin</FormLabel>
            <FormControl>
              <Input placeholder="Item origin" {...field} />
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
            <FormLabel>Assurance Value</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Assurance value" {...field} />
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
            <FormLabel>Date of Purchase</FormLabel>
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
            <FormLabel>HS Code</FormLabel>
            <FormControl>
              <Input placeholder="HS Code" {...field} />
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
            <FormLabel>Length</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Length" {...field} />
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
            <FormLabel>Width</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Width" {...field} />
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
            <FormLabel>Height</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Height" {...field} />
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
            <FormLabel>Weight</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" placeholder="Weight" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

