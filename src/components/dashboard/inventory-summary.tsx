"use client"

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts"
import { BarChart3, CircleDollarSign } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card"
import { useTranslations } from 'next-intl'

// Chart colors
const CHART_COLORS = [
  "#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"
]

interface InventorySummaryProps {
  topCategories: Array<{
    id: string
    name: string
    total_value: number
    item_count: number
  }>
  title: string
}

export function InventorySummary({ topCategories, title }: InventorySummaryProps) {
  const t = useTranslations()
  
  // Format for chart data
  const chartData = topCategories.map(cat => ({
    name: cat.name,
    value: Number(cat.total_value) || 0
  }))
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  // Format for tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow p-2">
          <p className="font-medium text-sm">{payload[0].payload.name}</p>
          <p className="text-xs text-muted-foreground">{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{t("dashboard.inventorySummary.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                layout="vertical"
              >
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => formatCurrency(value)} 
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  fontSize={12}
                  tickLine={false}
                  tickMargin={8}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" background={{ fill: '#f5f5f5' }}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
              {t("dashboard.inventorySummary.empty")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 