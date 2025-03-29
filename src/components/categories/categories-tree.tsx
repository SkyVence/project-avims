"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChevronRight, ChevronDown, Folder, Tag } from "lucide-react"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { useTranslations } from "next-intl"

type SubFamily = {
  id: string
  name: string
}

type Family = {
  id: string
  name: string
  subFamilies: SubFamily[]
}

type Category = {
  id: string
  name: string
  families: Family[]
}

interface CategoriesTreeProps {
  categories: Category[]
}

export function CategoriesTree({ categories }: CategoriesTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedFamilies, setExpandedFamilies] = useState<string[]>([])
  const t = useTranslations()

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleFamily = (familyId: string) => {
    setExpandedFamilies((prev) =>
      prev.includes(familyId) ? prev.filter((id) => id !== familyId) : [...prev, familyId],
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('categories.manager.tabs.tree')}</CardTitle>
        <CardDescription>{t('categories.manager.search.placeholder')}</CardDescription>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Tag className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <p className="mt-2 text-lg font-medium">{t('categories.manager.categories.empty')}</p>
            <p className="text-sm text-muted-foreground">{t('categories.manager.categories.description')}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="rounded-md border">
                <div
                  className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center">
                    {expandedCategories.includes(category.id) ? (
                      <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                    )}
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    <Link
                      href={`/categories/${category.id}`}
                      className="font-medium hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {category.name}
                    </Link>
                  </div>
                  <Badge variant="outline">
                    {category.families.length}{" "}
                    {t('categories.manager.families.single', { count: category.families.length })}
                  </Badge>
                </div>

                {expandedCategories.includes(category.id) && (
                  <div className="pl-8 pr-2 pb-2 space-y-1">
                    {category.families.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-1">
                        {t('categories.manager.families.empty.families')}
                      </p>
                    ) : (
                      category.families.map((family) => (
                        <div key={family.id} className="rounded-md border">
                          <div
                            className="flex items-center justify-between p-2 cursor-pointer hover:bg-accent"
                            onClick={() => toggleFamily(family.id)}
                          >
                            <div className="flex items-center">
                              {expandedFamilies.includes(family.id) ? (
                                <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                              )}
                              <Folder className="h-4 w-4 mr-2 text-primary" />
                              <span>{family.name}</span>
                            </div>
                            <Badge variant="outline">
                              {family.subFamilies.length}{" "}
                              {t('categories.manager.subfamilies.single', { count: family.subFamilies.length })}
                            </Badge>
                          </div>

                          {expandedFamilies.includes(family.id) && (
                            <div className="pl-8 pr-2 pb-2">
                              {family.subFamilies.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-1">
                                  {t('categories.manager.subfamilies.empty.subfamilies')}
                                </p>
                              ) : (
                                <div className="space-y-1">
                                  {family.subFamilies.map((subFamily) => (
                                    <div
                                      key={subFamily.id}
                                      className="flex items-center p-2 rounded-md hover:bg-accent"
                                    >
                                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                                      <span>{subFamily.name}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

