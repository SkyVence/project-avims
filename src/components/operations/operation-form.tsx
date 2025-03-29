"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import {
  AlertCircle,
  CalendarIcon,
  Check,
  MapPin,
  Package,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { FileUpload } from "@/components/ui/file-upload"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { handleError } from "@/lib/error-handler"

export const operationFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().optional(),
  year: z.coerce
    .number()
    .int("Year must be a valid number")
    .positive("Year must be a positive number")
    .optional()
    .nullable()
    .transform((val) => (val === null ? undefined : val)),
  location: z.string().optional(),
  active: z.boolean().default(true),
  images: z
    .array(
      z.object({
        url: z.string(),
        key: z.string(),
      })
    )
    .default([]),
  operationItems: z
    .array(
      z
        .object({
          itemId: z.string().optional(),
          packageId: z.string().optional(),
          quantity: z.coerce
            .number()
            .int("Quantity must be a whole number")
            .positive("Quantity must be positive")
            .default(1),
        })
        .refine(
          (data) => (data.itemId && !data.packageId) || (!data.itemId && data.packageId),
          {
            message: "Either an item or a package must be selected",
          }
        )
    )
    .default([]),
})

type OperationFormValues = z.infer<typeof operationFormSchema>

interface OperationFormProps {
  initialData?: OperationFormValues
  onSubmit: (data: OperationFormValues) => Promise<void>
  items: {
    id: string
    name: string
    description?: string | null
    brand: string
    value: number
    image?: {
      url: string
      key: string
    } | null
    category: {
      name: string
    }
    family: {
      name: string
    }
    subFamily: {
      name: string
    }
  }[]
  packages: {
    id: string
    name: string
    description?: string | null
    images: {
      url: string
      key: string
    }[]
    packageItems: {
      itemId: string
      quantity: number
      item: {
        name: string
        value: number
      }
    }[]
  }[]
}

export function OperationForm({
  initialData,
  onSubmit,
  items,
  packages,
}: OperationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"items" | "packages">("items")

  const form = useForm<OperationFormValues>({
    resolver: zodResolver(operationFormSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      year: undefined,
      location: "",
      active: true,
      images: [],
      operationItems: [],
    },
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "operationItems",
  })

  const handleSubmit = async (data: OperationFormValues) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast({
        title: "Success",
        description: initialData
          ? "Operation updated successfully."
          : "Operation created successfully.",
      })
      router.push("/operations")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter out items and packages that are already selected
  const selectedItemIds = fields
    .filter((field) => field.itemId)
    .map((field) => field.itemId) as string[]

  const selectedPackageIds = fields
    .filter((field) => field.packageId)
    .map((field) => field.packageId) as string[]

  const availableItems = items.filter(
    (item) => !selectedItemIds.includes(item.id)
  )
  const availablePackages = packages.filter(
    (pkg) => !selectedPackageIds.includes(pkg.id)
  )

  // Calculate total value of the operation
  const totalValue = fields.reduce((total, field) => {
    if (field.itemId) {
      const item = items.find((i) => i.id === field.itemId)
      if (item) {
        return total + item.value * field.quantity
      }
    } else if (field.packageId) {
      const pkg = packages.find((p) => p.id === field.packageId)
      if (pkg) {
        const packageValue = pkg.packageItems.reduce(
          (sum, pi) => sum + pi.item.value * pi.quantity,
          0
        )
        return total + packageValue * field.quantity
      }
    }
    return total
  }, 0)

  // Handle component selection
  const handleComponentSelection = () => {
    if (activeTab === "items" && availableItems.length === 0) {
      handleError("All items have been added to this operation.", {
        title: "No items available",
        variant: "destructive"
      })
      return
    }

    if (activeTab === "packages" && availablePackages.length === 0) {
      handleError("All packages have been added to this operation.", {
        title: "No packages available",
        variant: "destructive"
      })
      return
    }

    if (activeTab === "items" && availableItems.length > 0) {
      // Get the first available item to use as default
      const defaultItemId = availableItems[0]?.id || ""
      append({ itemId: defaultItemId, quantity: 1 })
      
      // Show success toast
      toast({
        title: "Item added",
        description: "Item has been added to the operation.",
      })
    } else if (activeTab === "packages" && availablePackages.length > 0) {
      // Get the first available package to use as default
      const defaultPackageId = availablePackages[0]?.id || ""
      append({ packageId: defaultPackageId, quantity: 1 })
      
      // Show success toast
      toast({
        title: "Package added",
        description: "Package has been added to the operation.",
      })
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Basic Operation Information */}
          <Card>
            <CardHeader>
              <CardTitle>Operation Information</CardTitle>
              <CardDescription>
                Basic details about the operation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter operation name"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter operation description"
                        {...field}
                        value={field.value || ""}
                        disabled={isLoading}
                        className="min-h-[120px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Year and Location Fields */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="YYYY"
                            className="pl-9"
                            {...field}
                            value={field.value || ""}
                            disabled={isLoading}
                          />
                        </div>
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
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter location"
                            className="pl-9"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Active Status Field */}
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Is this operation currently active?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images and Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Operation Images & Summary</CardTitle>
              <CardDescription>
                Upload images and view operation summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images Field */}
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
                          field.onChange(field.value.filter((file) => file.key !== key))
                        }
                        endpoint="imageUploader"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Operation Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Operation Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold">
                          {fields.filter((field) => field.itemId).length}
                        </h3>
                        <p className="text-sm text-muted-foreground">Items</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-xl font-bold">
                          {fields.filter((field) => field.packageId).length}
                        </h3>
                        <p className="text-sm text-muted-foreground">Packages</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-2">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold">
                          {totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}€
                        </h3>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Operation Items */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Operation Components</CardTitle>
                <CardDescription>
                  Add items and packages to this operation
                </CardDescription>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleComponentSelection()
                      }}
                      className="gap-1"
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                      Add Component
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add items or packages to this operation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="items" 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "items" | "packages")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="items" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Items
                </TabsTrigger>
                <TabsTrigger value="packages" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Packages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="mt-4 space-y-4">
                {fields.filter((field) => field.itemId).length === 0 ? (
                  <Alert variant="default" className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No items added</AlertTitle>
                    <AlertDescription>
                      Click the &quot;Add Component&quot; button to add items to this operation.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      if (!field.itemId) return null;
                      
                      const item = items.find((i) => i.id === field.itemId);
                      
                      return (
                        <Card key={field.id} className="overflow-hidden">
                          <div className="flex justify-between border-b p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                                {item?.image ? (
                                  <Image
                                    src={item.image.url}
                                    alt={item?.name || "Item"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                {item ? (
                                  <>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {item.category.name}
                                    </p>
                                  </>
                                ) : (
                                  <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                          <CardContent className="p-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`operationItems.${index}.itemId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      disabled={isLoading}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select an item" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {/* Always show the currently selected item if one exists */}
                                        {field.value && (
                                          <SelectItem value={field.value}>
                                            {items.find(i => i.id === field.value)?.name}
                                          </SelectItem>
                                        )}
                                        {/* Show all available items that aren't the current selection */}
                                        {availableItems
                                          .filter(item => item.id !== field.value)
                                          .map((item) => (
                                            <SelectItem key={item.id} value={item.id}>
                                              {item.name}
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`operationItems.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        {...field}
                                        disabled={isLoading}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="packages" className="mt-4 space-y-4">
                {fields.filter((field) => field.packageId).length === 0 ? (
                  <Alert variant="default" className="bg-muted">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No packages added</AlertTitle>
                    <AlertDescription>
                      Click the &quot;Add Component&quot; button to add packages to this operation.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => {
                      if (!field.packageId) return null;
                      
                      const pkg = packages.find((p) => p.id === field.packageId);
                      
                      return (
                        <Card key={field.id} className="overflow-hidden">
                          <div className="flex justify-between border-b p-4">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                                {pkg?.images?.[0] ? (
                                  <Image
                                    src={pkg.images[0].url}
                                    alt={pkg?.name || "Package"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Package className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                {pkg ? (
                                  <>
                                    <h4 className="font-medium">{pkg.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {pkg.packageItems.length} items
                                    </p>
                                  </>
                                ) : (
                                  <div className="h-8 w-32 animate-pulse rounded bg-muted"></div>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                              className="text-destructive hover:text-destructive"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove package</span>
                            </Button>
                          </div>
                          <CardContent className="p-4 pt-6">
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`operationItems.${index}.packageId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Package</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                      disabled={isLoading}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a package" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {/* Always show the currently selected package if one exists */}
                                        {field.value && (
                                          <SelectItem value={field.value}>
                                            {packages.find(p => p.id === field.value)?.name}
                                          </SelectItem>
                                        )}
                                        {/* Show all available packages that aren't the current selection */}
                                        {availablePackages
                                          .filter(pkg => pkg.id !== field.value)
                                          .map((pkg) => (
                                            <SelectItem key={pkg.id} value={pkg.id}>
                                              {pkg.name}
                                            </SelectItem>
                                          ))
                                        }
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`operationItems.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        {...field}
                                        disabled={isLoading}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Saving...</>
              ) : initialData ? (
                <>Save Changes</>
              ) : (
                <>Create Operation</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
} 