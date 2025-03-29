"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "@/hooks/use-toast";
import { FileUpload } from "../ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const itemFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  brand: z.string().optional(),
  value: z.coerce.number().optional(),
  insuranceValue: z.coerce.number().optional(),
  hsCode: z.string().optional(),
  location: z.string().optional(),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  categoryId: z.string().optional(),
  familyId: z.string().optional(),
  subFamilyId: z.string().optional(),
  quantity: z.coerce.number().int().positive().default(1),
  images: z
    .array(
      z.object({
        url: z.string(),
        key: z.string(),
      })
    )
    .default([]),
});

type ItemFormValues = z.infer<typeof itemFormSchema>;

type Category = {
  id: string;
  name: string;
};

type Family = {
  id: string;
  name: string;
  categoryId: string;
};

type SubFamily = {
  id: string;
  name: string;
  familyId: string;
};

interface ItemFormProps {
  initialData?: ItemFormValues;
  onSubmit: (data: ItemFormValues) => Promise<void>;
  categories: Category[];
  families: Family[];
  subFamilies: SubFamily[];
}

export function ItemForm({
  initialData,
  onSubmit,
  categories,
  families,
  subFamilies,
}: ItemFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [availableFamilies, setAvailableFamilies] = useState<Family[]>([]);
  const [availableSubFamilies, setAvailableSubFamilies] = useState<SubFamily[]>(
    []
  );

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      brand: "",
      value: undefined,
      insuranceValue: undefined,
      hsCode: "",
      location: "",
      length: undefined,
      width: undefined,
      height: undefined,
      weight: undefined,
      categoryId: undefined,
      familyId: undefined,
      subFamilyId: undefined,
      quantity: 1,
      images: [],
    },
  });

  // Update available families when category changes
  const selectedCategoryId = form.watch("categoryId");
  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = families.filter(
        (f) => f.categoryId === selectedCategoryId
      );
      setAvailableFamilies(filtered);

      // Clear family selection if the selected family is not in the filtered list
      const currentFamilyId = form.getValues("familyId");
      if (currentFamilyId && !filtered.some((f) => f.id === currentFamilyId)) {
        form.setValue("familyId", undefined);
        form.setValue("subFamilyId", undefined);
      }
    } else {
      setAvailableFamilies([]);
      form.setValue("familyId", undefined);
      form.setValue("subFamilyId", undefined);
    }
  }, [selectedCategoryId, families, form]);

  // Update available sub-families when family changes
  const selectedFamilyId = form.watch("familyId");
  useEffect(() => {
    if (selectedFamilyId) {
      const filtered = subFamilies.filter(
        (sf) => sf.familyId === selectedFamilyId
      );
      setAvailableSubFamilies(filtered);

      // Clear sub-family selection if the selected sub-family is not in the filtered list
      const currentSubFamilyId = form.getValues("subFamilyId");
      if (
        currentSubFamilyId &&
        !filtered.some((sf) => sf.id === currentSubFamilyId)
      ) {
        form.setValue("subFamilyId", undefined);
      }
    } else {
      setAvailableSubFamilies([]);
      form.setValue("subFamilyId", undefined);
    }
  }, [selectedFamilyId, subFamilies, form]);

  const handleSubmit = async (data: ItemFormValues) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
      toast({
        title: "Success",
        description: initialData ? "Item updated." : "Item created.",
      });
      router.push("/items");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate volume based on dimensions
  const length = form.watch("length") || 0;
  const width = form.watch("width") || 0;
  const height = form.watch("height") || 0;
  const volume = length * width * height;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Item description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder="Brand name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
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
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Storage location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Volume (cm³)</FormLabel>
                <FormControl>
                  <Input type="number" value={volume.toFixed(2)} disabled />
                </FormControl>
                <FormDescription>Calculated automatically</FormDescription>
              </FormItem>
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="familyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={
                        !form.getValues("categoryId") ||
                        availableFamilies.length === 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select family" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableFamilies.map((family) => (
                          <SelectItem key={family.id} value={family.id}>
                            {family.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subFamilyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sub-Family</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={
                        !form.getValues("familyId") ||
                        availableSubFamilies.length === 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sub-family" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSubFamilies.map((subFamily) => (
                          <SelectItem key={subFamily.id} value={subFamily.id}>
                            {subFamily.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <FileUpload
                      value={field.value}
                      onChange={(files) => field.onChange(files)}
                      onRemove={(key) =>
                        field.onChange(
                          field.value.filter((file) => file.key !== key)
                        )}
                      endpoint="imageUploader"
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/items")}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
