import Link from "next/link"
import { 
  Plus, 
  Download, 
  Upload,
  BarChart3,
  PackageOpen,
  ShoppingBag,
  Truck
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../ui/card"
import { Button } from "../ui/button"
import { useTranslations } from "next-intl"

interface QuickActionsProps {
  title: string
}

export function QuickActions({ title }: QuickActionsProps) {
  const t = useTranslations()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{t('dashboard.quickActions.description')}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button asChild variant="outline" className="justify-start" size="sm">
          <Link href="/items/new">
            <Plus className="mr-2 h-4 w-4" /> 
            {t('dashboard.quickActions.buttons.newItem')}
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="justify-start" size="sm">
          <Link href="/packages/new">
            <PackageOpen className="mr-2 h-4 w-4" /> 
            {t('dashboard.quickActions.buttons.newPackage')}
          </Link>
        </Button>
        
        <Button asChild variant="outline" className="justify-start" size="sm">
          <Link href="/operations/new">
            <Truck className="mr-2 h-4 w-4" /> 
            {t('dashboard.quickActions.buttons.newOperation')}
          </Link>
        </Button>
        
        <Card className="border-dashed mt-2">
          <CardContent className="p-3 grid grid-cols-2 gap-2">
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/import">
                <Upload className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">{t('dashboard.quickActions.buttons.import')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/export">
                <Download className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">{t('dashboard.quickActions.buttons.export')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/items">
                <ShoppingBag className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">{t('dashboard.quickActions.buttons.items')}</span>
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="justify-start">
              <Link href="/reports">
                <BarChart3 className="mr-2 h-3.5 w-3.5" /> 
                <span className="text-xs">{t('dashboard.quickActions.buttons.reports')}</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
} 