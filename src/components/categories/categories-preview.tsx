"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Search, Tag, ChevronRight, ChevronDown, Folder } from "lucide-react"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { CategoriesTree } from "./categories-tree"
import { useTranslations } from "next-intl"

type Category = {
  id: string
  name: string
  families: Family[]
}

type Family = {
  id: string
  name: string
  subFamilies: SubFamily[]
}

type SubFamily = {
  id: string
  name: string
}

export function CategoriesPreview() {
  const t = useTranslations()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedFamilies, setExpandedFamilies] = useState<string[]>([])

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Filter categories based on search query
  const filteredCategories = searchQuery
    ? categories.filter((category) => {
        const categoryMatch = category.name.toLowerCase().includes(searchQuery.toLowerCase())
        const familyMatch = category.families.some((family) =>
          family.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        const subFamilyMatch = category.families.some((family) =>
          family.subFamilies.some((subFamily) => subFamily.name.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        return categoryMatch || familyMatch || subFamilyMatch
      })
    : categories

  // Toggle expanded state for categories
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  // Toggle expanded state for families
  const toggleFamily = (familyId: string) => {
    setExpandedFamilies((prev) =>
      prev.includes(familyId) ? prev.filter((id) => id !== familyId) : [...prev, familyId],
    )
  }

  // Count total items in each category
  const getCategoryStats = (category: Category) => {
    const familyCount = category.families.length
    const subFamilyCount = category.families.reduce((acc, family) => acc + family.subFamilies.length, 0)
    return { familyCount, subFamilyCount }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('categories.manager.categories.title')}</h1>
        <p className="text-muted-foreground">{t('categories.manager.categories.description')}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('categories.manager.search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 w-full"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Tag className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">{t('categories.manager.categories.empty')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery ? t('common.noResults') : t('categories.manager.categories.empty')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="cards" className="space-y-4">
          <TabsList>
            <TabsTrigger value="cards">{t('categories.manager.tabs.cards')}</TabsTrigger>
            <TabsTrigger value="tree">{t('categories.manager.tabs.tree')}</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCategories.map((category) => {
                const { familyCount, subFamilyCount } = getCategoryStats(category)
                return (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Tag className="mr-2 h-4 w-4 text-primary" />
                          <Link href={`/categories/${category.id}`} className="hover:underline">
                            {category.name}
                          </Link>
                        </CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {familyCount} {familyCount === 1 ? t('categories.manager.families.single') : t('categories.manager.families.plural')}
                        </Badge>
                      </div>
                      <CardDescription>
                        {subFamilyCount} {subFamilyCount === 1 ? t('categories.manager.subfamilies.single') : t('categories.manager.subfamilies.plural')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategories.includes(category.id) ? (
                          <ChevronDown className="mr-2 h-4 w-4" />
                        ) : (
                          <ChevronRight className="mr-2 h-4 w-4" />
                        )}
                        {expandedCategories.includes(category.id) ? t('categories.manager.buttons.hideDetails') : t('categories.manager.buttons.viewDetails')}
                      </Button>

                      {expandedCategories.includes(category.id) && (
                        <div className="mt-2 space-y-2">
                          {category.families.length === 0 ? (
                            <p className="text-sm text-muted-foreground">{t('categories.manager.families.empty.families')}</p>
                          ) : (
                            <Accordion type="multiple" className="w-full">
                              {category.families.map((family) => (
                                <AccordionItem key={family.id} value={family.id} className="border-b-0">
                                  <AccordionTrigger className="py-2 text-sm hover:no-underline">
                                    <div className="flex items-center">
                                      <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                                      {family.name}
                                      <Badge variant="outline" className="ml-2 text-xs">
                                        {family.subFamilies.length}
                                      </Badge>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pl-6">
                                    {family.subFamilies.length === 0 ? (
                                      <p className="text-sm text-muted-foreground">{t('categories.manager.subfamilies.empty.subfamilies')}</p>
                                    ) : (
                                      <ul className="space-y-1">
                                        {family.subFamilies.map((subFamily) => (
                                          <li key={subFamily.id} className="text-sm flex items-center py-1">
                                            <div className="h-1 w-1 rounded-full bg-muted-foreground mr-2" />
                                            {subFamily.name}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="tree">
            <CategoriesTree categories={filteredCategories} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

