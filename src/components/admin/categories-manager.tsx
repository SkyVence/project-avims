"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Plus, Trash, Edit } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { CategoryDialog } from "./category-dialog"
import { FamilyDialog } from "./family-dialog"
import { SubFamilyDialog } from "./subfamily-dialog"
import { toast } from "@/hooks/use-toast"
import { deleteCategory, deleteFamily, deleteSubFamily } from "../../app/actions/admin"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"
import { handleError } from "@/lib/error-handler"

type SubFamily = {
  id: string
  name: string
  familyId: string
}

type Family = {
  id: string
  name: string
  categoryId: string
  subFamilies: SubFamily[]
}

type Category = {
  id: string
  name: string
  families: Family[]
}

interface CategoriesManagerProps {
  initialCategories: Category[]
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [isLoading, setIsLoading] = useState(false)

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [familyDialogOpen, setFamilyDialogOpen] = useState(false)
  const [subFamilyDialogOpen, setSubFamilyDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingFamily, setEditingFamily] = useState<Family | null>(null)
  const [editingSubFamily, setEditingSubFamily] = useState<SubFamily | null>(null)

  // Delete states
  const [deleteType, setDeleteType] = useState<"category" | "family" | "subfamily">("category")
  const [deleteId, setDeleteId] = useState<string>("")
  const [deleteName, setDeleteName] = useState<string>("")

  // Handle category creation/update
  const handleCategoryChange = (category: Category, isNew: boolean) => {
    if (isNew) {
      setCategories([...categories, category])
    } else {
      setCategories(categories.map((c) => (c.id === category.id ? { ...c, name: category.name } : c)))
    }
  }

  // Handle family creation/update
  const handleFamilyChange = (family: Family, isNew: boolean) => {
    if (isNew) {
      const newFamily = { ...family, subFamilies: [] }
      setCategories(
        categories.map((c) => (c.id === family.categoryId ? { ...c, families: [...c.families, newFamily] } : c)),
      )
    } else {
      setCategories(
        categories.map((c) => ({
          ...c,
          families: c.families.map((f) =>
            f.id === family.id ? { ...f, name: family.name, categoryId: family.categoryId } : f,
          ),
        })),
      )
    }
  }

  // Handle sub-family creation/update
  const handleSubFamilyChange = (subFamily: SubFamily, isNew: boolean) => {
    if (isNew) {
      setCategories(
        categories.map((c) => ({
          ...c,
          families: c.families.map((f) =>
            f.id === subFamily.familyId ? { ...f, subFamilies: [...f.subFamilies, subFamily] } : f,
          ),
        })),
      )
    } else {
      setCategories(
        categories.map((c) => ({
          ...c,
          families: c.families.map((f) => ({
            ...f,
            subFamilies: f.subFamilies.map((sf) =>
              sf.id === subFamily.id ? { ...sf, name: subFamily.name, familyId: subFamily.familyId } : sf,
            ),
          })),
        })),
      )
    }
  }

  // Handle delete confirmation
  const confirmDelete = (type: "category" | "family" | "subfamily", id: string, name: string) => {
    setDeleteType(type)
    setDeleteId(id)
    setDeleteName(name)
    setDeleteDialogOpen(true)
  }

  // Handle delete action
  const handleDelete = async () => {
    try {
      setIsLoading(true)

      if (deleteType === "category") {
        await deleteCategory(deleteId)
        setCategories(categories.filter((c) => c.id !== deleteId))
      } else if (deleteType === "family") {
        await deleteFamily(deleteId)
        setCategories(
          categories.map((c) => ({
            ...c,
            families: c.families.filter((f) => f.id !== deleteId),
          })),
        )
      } else if (deleteType === "subfamily") {
        await deleteSubFamily(deleteId)
        setCategories(
          categories.map((c) => ({
            ...c,
            families: c.families.map((f) => ({
              ...f,
              subFamilies: f.subFamilies.filter((sf) => sf.id !== deleteId),
            })),
          })),
        )
      }

      toast({
        title: "Success",
        description: `${deleteType} deleted successfully.`,
      })
    } catch (error) {
      handleError(error, {
        title: "Error",
        defaultMessage: `Failed to delete ${deleteType}.`
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <Tabs defaultValue="categories">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="families">Families</TabsTrigger>
            <TabsTrigger value="subfamilies">Sub-Families</TabsTrigger>
          </TabsList>
          <div className="space-x-2">
            <Button
              onClick={() => {
                setEditingCategory(null)
                setCategoryDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
            <Button
              onClick={() => {
                setEditingFamily(null)
                setFamilyDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Family
            </Button>
            <Button
              onClick={() => {
                setEditingSubFamily(null)
                setSubFamilyDialogOpen(true)
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Sub-Family
            </Button>
          </div>
        </div>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage item categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No categories found. Create one to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="font-medium">{category.name}</div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCategory(category)
                            setCategoryDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete("category", category.id, category.name)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="families" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Families</CardTitle>
              <CardDescription>Manage item families</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No categories found. Create a category first.
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border rounded-md">
                      <AccordionTrigger className="px-4">
                        <span className="font-medium">{category.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {category.families.length === 0 ? (
                          <div className="text-center py-2 text-muted-foreground">
                            No families found in this category.
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {category.families.map((family) => (
                              <div key={family.id} className="flex items-center justify-between p-3 border rounded-md">
                                <div className="font-medium">{family.name}</div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingFamily(family)
                                      setFamilyDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => confirmDelete("family", family.id, family.name)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subfamilies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sub-Families</CardTitle>
              <CardDescription>Manage item sub-families</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No categories found. Create a category first.
                </div>
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border rounded-md">
                      <AccordionTrigger className="px-4">
                        <span className="font-medium">{category.name}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {category.families.length === 0 ? (
                          <div className="text-center py-2 text-muted-foreground">
                            No families found in this category.
                          </div>
                        ) : (
                          <Accordion type="multiple" className="space-y-2">
                            {category.families.map((family) => (
                              <AccordionItem key={family.id} value={family.id} className="border rounded-md">
                                <AccordionTrigger className="px-4">
                                  <span className="font-medium">{family.name}</span>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                  {family.subFamilies.length === 0 ? (
                                    <div className="text-center py-2 text-muted-foreground">
                                      No sub-families found in this family.
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {family.subFamilies.map((subFamily) => (
                                        <div
                                          key={subFamily.id}
                                          className="flex items-center justify-between p-3 border rounded-md"
                                        >
                                          <div className="font-medium">{subFamily.name}</div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => {
                                                setEditingSubFamily(subFamily)
                                                setSubFamilyDialogOpen(true)
                                              }}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => confirmDelete("subfamily", subFamily.id, subFamily.name)}
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={editingCategory}
        onSave={handleCategoryChange}
      />

      {/* Family Dialog */}
      <FamilyDialog
        open={familyDialogOpen}
        onOpenChange={setFamilyDialogOpen}
        family={editingFamily}
        categories={categories}
        onSave={handleFamilyChange}
      />

      {/* Sub-Family Dialog */}
      <SubFamilyDialog
        open={subFamilyDialogOpen}
        onOpenChange={setSubFamilyDialogOpen}
        subFamily={editingSubFamily}
        categories={categories}
        onSave={handleSubFamilyChange}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the {deleteType} "{deleteName}".
              {deleteType === "category" && " All families and sub-families in this category will also be deleted."}
              {deleteType === "family" && " All sub-families in this family will also be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

