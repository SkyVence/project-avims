"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ActivityIcon, Package, ShoppingBag, PackageCheck, Dot } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { useTranslations } from 'next-intl'

interface RecentActivityProps {
  recentItems: Array<{
    id: string
    name: string
    brand: string
    value: number
    createdAt: Date
    category: {
      name: string
    }
  }>
  recentPackages: Array<{
    id: string
    name: string
    description: string | null
    createdAt: Date
    _count: {
      packageItems: number
    }
  }>
  recentOperations: Array<{
    id: string
    name: string
    description: string | null
    createdAt: Date
    _count: {
      operationItems: number
    }
  }>
  title: string
}

export function RecentActivity({ 
  recentItems, 
  recentPackages, 
  recentOperations,
  title 
}: RecentActivityProps) {
  const t = useTranslations()
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ActivityIcon className="mr-2 h-5 w-5 text-muted-foreground" /> 
          {title}
        </CardTitle>
        <CardDescription>
          {t("dashboard.recentActivity.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="items" className="space-y-4">
          <TabsList className="grid grid-cols-3 h-9">
            <TabsTrigger value="items" className="text-xs h-8">
              <ShoppingBag className="mr-1 h-3.5 w-3.5" />
              {t("dashboard.recentActivity.tabs.items")}
            </TabsTrigger>
            <TabsTrigger value="packages" className="text-xs h-8">
              <Package className="mr-1 h-3.5 w-3.5" />
              {t("dashboard.recentActivity.tabs.packages")}
            </TabsTrigger>
            <TabsTrigger value="operations" className="text-xs h-8">
              <PackageCheck className="mr-1 h-3.5 w-3.5" />
              {t("dashboard.recentActivity.tabs.operations")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="space-y-4">
            {recentItems.length > 0 ? (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <Link 
                        href={`/items/${item.id}`} 
                        className="text-sm font-medium leading-none hover:underline truncate inline-block max-w-full"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <span>{item.brand}</span>
                        <Dot className="h-4 w-4" />
                        <Badge variant="outline" className="text-[10px] h-4 px-1">
                          {item.category.name}
                        </Badge>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/items">{t("dashboard.recentActivity.viewAll.items")}</Link>
                </Button>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">{t("dashboard.recentActivity.empty.items")}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="packages" className="space-y-4">
            {recentPackages.length > 0 ? (
              <div className="space-y-4">
                {recentPackages.map((pkg) => (
                  <div key={pkg.id} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-500">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <Link 
                        href={`/packages/${pkg.id}`} 
                        className="text-sm font-medium leading-none hover:underline truncate inline-block max-w-full"
                      >
                        {pkg.name}
                      </Link>
                      <div className="text-xs text-muted-foreground truncate">
                        {pkg.description || t("dashboard.recentActivity.noDescription")}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium">
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {t("dashboard.recentActivity.itemCount", { count: pkg._count.packageItems })}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(pkg.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/packages">{t("dashboard.recentActivity.viewAll.packages")}</Link>
                </Button>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">{t("dashboard.recentActivity.empty.packages")}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="operations" className="space-y-4">
            {recentOperations.length > 0 ? (
              <div className="space-y-4">
                {recentOperations.map((operation) => (
                  <div key={operation.id} className="flex items-center">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500">
                      <PackageCheck className="h-5 w-5" />
                    </div>
                    <div className="ml-4 space-y-1 flex-1 min-w-0">
                      <Link 
                        href={`/operations/${operation.id}`} 
                        className="text-sm font-medium leading-none hover:underline truncate inline-block max-w-full"
                      >
                        {operation.name}
                      </Link>
                      <div className="text-xs text-muted-foreground truncate">
                        {operation.description || t("dashboard.recentActivity.noDescription")}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm font-medium">
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {t("dashboard.recentActivity.itemCount", { count: operation._count.operationItems })}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(operation.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button asChild variant="ghost" size="sm" className="w-full">
                  <Link href="/operations">{t("dashboard.recentActivity.viewAll.operations")}</Link>
                </Button>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">{t("dashboard.recentActivity.empty.operations")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

