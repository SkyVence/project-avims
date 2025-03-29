"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Tag, Folder, ArrowLeft, Box } from "lucide-react"
import Link from "next/link"
import { Separator } from "../ui/separator"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { formatDistanceToNow } from "date-fns"

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

type Item = {
  id: string
  name: string
  description: string | null
  brand: string | null
  createdAt: Date
}

interface CategoryDetailProps {
  category: Category
  items: Item[]
}

export function CategoryDetail({ category, items }: CategoryDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Tag className="mr-2 h-6 w-6 text-primary" />
            {category.name}
          </h1>
        </div>
        <Badge variant="outline" className="ml-2">
          {category.families.length} {category.families.length === 1 ? "family" : "families"}
        </Badge>
      </div>

      <Tabs defaultValue="structure" className="space-y-4">
        <TabsList>
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Structure</CardTitle>
              <CardDescription>Families and sub-families in this category</CardDescription>
            </CardHeader>
            <CardContent>
              {category.families.length === 0 ? (
                <div className="text-center py-8">
                  <Folder className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-lg font-medium">No families found</p>
                  <p className="text-sm text-muted-foreground">This category doesn't have any families yet</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {category.families.map((family) => (
                    <div key={family.id} className="space-y-2">
                      <div className="flex items-center">
                        <Folder className="mr-2 h-5 w-5 text-primary" />
                        <h3 className="text-lg font-medium">{family.name}</h3>
                        <Badge variant="outline" className="ml-2">
                          {family.subFamilies.length} {family.subFamilies.length === 1 ? "sub-family" : "sub-families"}
                        </Badge>
                      </div>
                      <Separator />
                      {family.subFamilies.length === 0 ? (
                        <p className="text-sm text-muted-foreground pl-7">No sub-families in this family</p>
                      ) : (
                        <div className="grid gap-2 pl-7 pt-2">
                          {family.subFamilies.map((subFamily) => (
                            <div key={subFamily.id} className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                              <span>{subFamily.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>Recently added items in this category</CardDescription>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <Box className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <p className="mt-2 text-lg font-medium">No items found</p>
                  <p className="text-sm text-muted-foreground">No items have been added to this category yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          <Box className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                        )}
                        {item.brand && (
                          <Badge variant="outline" className="text-xs">
                            {item.brand}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/items/${item.id}`}>View</Link>
                      </Button>
                    </div>
                  ))}
                  {items.length > 0 && (
                    <div className="flex justify-center pt-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/items?category=${category.id}`}>View all items</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

