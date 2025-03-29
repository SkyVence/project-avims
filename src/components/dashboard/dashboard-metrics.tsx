"use client"

import { 
  Package, 
  PackageCheck, 
  CircleDollarSign, 
  ShoppingBag, 
  Tag, 
  Layers 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { useTranslations } from 'next-intl'

interface DashboardMetricsProps {
  itemCount: number
  packageCount: number
  operationCount: number
  categoryCount: number
  inventoryValue: Array<{
    total_value: number
    item_count: number
    total_quantity: number
  }>
}

export function DashboardMetrics({ 
  itemCount, 
  packageCount, 
  operationCount,
  categoryCount,
  inventoryValue 
}: DashboardMetricsProps) {
  const t = useTranslations()
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value)
  }
  
  // Get total value
  const totalValue = inventoryValue[0] ? Number(inventoryValue[0].total_value) || 0 : 0
  const totalQuantity = inventoryValue[0] ? Number(inventoryValue[0].total_quantity) || 0 : 0
  
  // Calculate average item value
  const avgItemValue = itemCount > 0 ? totalValue / itemCount : 0
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.metrics.items.title")}</CardTitle>
          <ShoppingBag className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{itemCount}</div>
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              {t("dashboard.metrics.items.totalUnits", { count: totalQuantity })}
            </p>
          </div>
          <div className="mt-4 h-1">
            <Progress value={75} className="h-1 bg-blue-100 dark:bg-blue-900 [&>div]:bg-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.metrics.packages.title")}</CardTitle>
          <Package className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{packageCount}</div>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.metrics.packages.description", { count: categoryCount })}
          </p>
          <div className="mt-4 h-1">
            <Progress value={55} className="h-1 bg-amber-100 dark:bg-amber-900 [&>div]:bg-amber-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.metrics.operations.title")}</CardTitle>
          <PackageCheck className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{operationCount}</div>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.metrics.operations.description")}
          </p>
          <div className="mt-4 h-1">
            <Progress value={65} className="h-1 bg-green-100 dark:bg-green-900 [&>div]:bg-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/20 dark:to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t("dashboard.metrics.value.title")}</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.metrics.value.averagePerItem", { value: formatCurrency(avgItemValue) })}
          </p>
          <div className="mt-4 h-1">
            <Progress value={85} className="h-1 bg-purple-100 dark:bg-purple-900 [&>div]:bg-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 