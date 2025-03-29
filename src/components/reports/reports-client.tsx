"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Sector
} from "recharts"
import { format, subMonths, isAfter } from "date-fns"
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter,
  CardHeader, 
  CardTitle 
} from "../ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { BarChart3, Package, Layers, Boxes, TrendingUp, CircleDollarSign } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

// Array of colors for charts
const CHART_COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c",
  "#d0ed57", "#ffc658", "#ff8042", "#ff5252", "#ba68c8"
]

// Time range options
const TIME_RANGES = [
  { value: "1m", label: "trendAnalysis.timeRanges.1m" },
  { value: "3m", label: "trendAnalysis.timeRanges.3m" },
  { value: "6m", label: "trendAnalysis.timeRanges.6m" },
  { value: "1y", label: "trendAnalysis.timeRanges.1y" },
  { value: "all", label: "trendAnalysis.timeRanges.all" }
]

interface ReportsClientProps {
  operationsGrowth: Array<{
    month: string
    count: number
    active_count: number
  }>
  packagesGrowth: Array<{
    month: string
    count: number
    active_count: number
  }>
  categoryDistribution: Array<{
    id: string
    name: string
    _count: {
      items: number
    }
  }>
  familyDistribution: Array<{
    id: string
    name: string
    category: {
      name: string
    }
    _count: {
      items: number
    }
  }>
  inventoryValue: Array<{
    total_value: number
    total_insurance_value: number
    item_count: number
    total_quantity: number
  }>
  topItems: Array<{
    id: string
    name: string
    brand: string
    value: number
    insuranceValue: number
    quantity: number
    category: {
      name: string
    }
  }>
  valueByCategory: Array<{
    category_name: string
    total_value: number
  }>
}

export function ReportsClient({
  operationsGrowth,
  packagesGrowth,
  categoryDistribution,
  familyDistribution,
  inventoryValue,
  topItems,
  valueByCategory
}: ReportsClientProps) {
  const t = useTranslations('reports')
  
  // State for time range selection
  const [timeRange, setTimeRange] = useState("all")
  
  // State for active pie chart sector
  const [activePieIndex, setActivePieIndex] = useState(0)
  
  // Format date strings for growth charts
  const formatGrowthData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      month: format(new Date(item.month), "MMM yyyy"),
      count: Number(item.count),
      active_count: Number(item.active_count)
    }))
  }
  
  // Filter data based on time range
  const filterDataByTimeRange = (data: any[]) => {
    if (timeRange === 'all') return data
    
    const now = new Date()
    let monthsAgo: Date
    
    switch (timeRange) {
      case '1m':
        monthsAgo = subMonths(now, 1)
        break
      case '3m':
        monthsAgo = subMonths(now, 3)
        break
      case '6m':
        monthsAgo = subMonths(now, 6)
        break
      case '1y':
        monthsAgo = subMonths(now, 12)
        break
      default:
        return data
    }
    
    return data.filter(item => {
      const itemDate = new Date(item.month)
      return isAfter(itemDate, monthsAgo)
    })
  }
  
  // Format category distribution data for charts
  const formatCategoryDistribution = () => {
    return categoryDistribution.map(cat => ({
      name: cat.name,
      value: cat._count.items
    }))
  }
  
  // Format family distribution data for charts
  const formatFamilyDistribution = () => {
    return familyDistribution.map(family => ({
      name: `${family.name} (${family.category.name})`,
      value: family._count.items
    }))
  }
  
  // Format value by category for charts
  const formatValueByCategory = () => {
    return valueByCategory.map(cat => ({
      name: cat.category_name,
      value: Number(cat.total_value)
    }))
  }
  
  // Prepare operations data for chart
  const operationsData = filterDataByTimeRange(formatGrowthData(operationsGrowth))
  
  // Prepare packages data for chart
  const packagesData = filterDataByTimeRange(formatGrowthData(packagesGrowth))
  
  // Prepare inventory summary
  const inventorySummary = inventoryValue[0] ? {
    totalValue: Number(inventoryValue[0].total_value) || 0,
    totalInsuranceValue: Number(inventoryValue[0].total_insurance_value) || 0,
    itemCount: Number(inventoryValue[0].item_count) || 0,
    totalQuantity: Number(inventoryValue[0].total_quantity) || 0
  } : {
    totalValue: 0,
    totalInsuranceValue: 0,
    itemCount: 0,
    totalQuantity: 0
  }
  
  // Custom active shape for pie charts to show more detail
  const renderActiveShape = (props: any) => {
    const { 
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill, payload, percent, value 
    } = props
    
    return (
      <g>
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#888888">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#000000" fontSize={20} fontWeight={500}>
          {value}
        </text>
        <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#888888">
          {`(${(percent * 100).toFixed(1)}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }
  
  // Custom formatter for monetary values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value)
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('trendAnalysis.title')}</h2>
        <Select 
          value={timeRange} 
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('selects.timeRange.placeholder')} />
          </SelectTrigger>
          <SelectContent>
            {TIME_RANGES.map(range => (
              <SelectItem key={range.value} value={range.value}>
                {t(range.label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="operations">
        <TabsList className="mb-4">
          <TabsTrigger value="operations" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {t('operations.title')}
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {t('packages.title')}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="operations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('operations.cardTitle')}
              </CardTitle>
              <CardDescription>
                {t('operations.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={operationsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, t('charts.tooltips.operations')]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name={t('operations.total')}
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="active_count" 
                      name={t('operations.active')}
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {t('packages.cardTitle')}
              </CardTitle>
              <CardDescription>
                {t('packages.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={packagesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, t('charts.tooltips.packages')]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name={t('packages.total')}
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="active_count" 
                      name={t('packages.active')}
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.totalItems.title')}</CardTitle>
            <Boxes className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.itemCount}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.totalItems.description')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.totalQuantity.title')}</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventorySummary.totalQuantity}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.totalQuantity.description')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.totalValue.title')}</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(inventorySummary.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.totalValue.description')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.insuranceValue.title')}</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(inventorySummary.totalInsuranceValue)}</div>
            <p className="text-xs text-muted-foreground">
              {t('inventory.insuranceValue.description')}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mt-8">{t('distribution.title')}</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('distribution.byCategory.title')}
            </CardTitle>
            <CardDescription>
              {t('distribution.byCategory.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activePieIndex}
                    activeShape={renderActiveShape}
                    data={formatCategoryDistribution()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    onMouseEnter={(_, index) => setActivePieIndex(index)}
                  >
                    {formatCategoryDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} ${t('charts.tooltips.items')}`, t('charts.tooltips.count')]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t('distribution.valueByCategory.title')}
            </CardTitle>
            <CardDescription>
              {t('distribution.valueByCategory.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatValueByCategory()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `€${value.toLocaleString()}`} />
                  <Tooltip formatter={(value) => [formatCurrency(value as number), t('charts.tooltips.value')]} />
                  <Bar dataKey="value" name="Value" fill="#8884d8">
                    {formatValueByCategory().map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('topItems.title')}</CardTitle>
          <CardDescription>
            {t('topItems.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('topItems.table.name')}</TableHead>
                <TableHead>{t('topItems.table.brand')}</TableHead>
                <TableHead>{t('topItems.table.category')}</TableHead>
                <TableHead>{t('topItems.table.quantity')}</TableHead>
                <TableHead className="text-right">{t('topItems.table.valueUnit')}</TableHead>
                <TableHead className="text-right">{t('topItems.table.totalValue')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.category.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.value * item.quantity)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mt-8">{t('categoryFamily.title')}</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categoryDistribution.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold flex justify-between">
                <span>{category.name}</span>
                <Badge variant="outline">{category._count.items}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {familyDistribution
                  .filter(family => family.category.name === category.name)
                  .map(family => (
                    <div key={family.id} className="flex items-center justify-between">
                      <span className="text-sm">{family.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {t('categoryFamily.itemsCount', { count: family._count.items })}
                      </Badge>
                    </div>
                  ))
                }
                {familyDistribution.filter(family => family.category.name === category.name).length === 0 && (
                  <div className="text-sm text-muted-foreground py-2">{t('categoryFamily.noFamilies')}</div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 