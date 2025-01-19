'use client'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Package, PackageOpen } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  Pie,
  PieChart
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Link } from '@/i18n/routing';
import { useTranslations } from "next-intl";

interface Stats {
  totalValue: number;
  itemCount: number;
  packageCount: number;
  operationPackageCount: number;
}

interface RecentAction {
  id: string;
  type: string;
  details: string;
  createdAt: Date;
  user: { name: string };
}

interface InventoryData {
  date: string;
  count: number;
}

interface Item {
  id: string;
  name: string;
  brand: string;
  createdAt: Date;
  category: { name: string }[];
  family: { name: string }[];
  subFamily: { name: string }[];
}

interface CategoryData {
  name: string;
  items: { value: number }[];
}

interface DashboardUiProps {
  stats: Stats
  recentActions: RecentAction[]
  inventoryData: InventoryData[]
  categoryData: CategoryData[]
  items: Item[]
}

const DashboardUi: React.FC<DashboardUiProps> = ({
  categoryData,
  stats,
  recentActions,
  inventoryData,
  items,
}) => {

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const router = useRouter()
  const t = useTranslations('dashboardUI')

  const data = categoryData.map((category) => ({
    name: category.name,
    value: category.items.reduce((sum, item) => sum + item.value, 0),
  }));

  return (
    <div className="space-y-6 p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('stats-totalItems')}
                </CardTitle>
                <Box className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.itemCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('stats-totalPackages')}
                </CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.packageCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('stats-totalOperationPackages')}
                </CardTitle>
                <PackageOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.operationPackageCount}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t('stats-totalInventoryValue')}
                </CardTitle>
                <PackageOpen className="w-4 h-4 text-muted-foreground" /> 
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalValue.toFixed(2)}€
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                {t('recentItems-title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="mb-2 sm:mb-0">
                      <Link
                        href={`/items/${item.id}`}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.category.map((cat) => (
                          <Badge
                            key={cat.name}
                            variant="secondary"
                            className="text-xs"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                        {item.family.map((fam) => (
                          <Badge
                            key={fam.name}
                            variant="secondary"
                            className="text-xs"
                          >
                            {fam.name}
                          </Badge>
                        ))}
                        {item.subFamily.map((sfam) => (
                          <Badge
                            key={sfam.name}
                            variant="secondary"
                            className="text-xs"
                          >
                            {sfam.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="font-medium">{item.brand}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {t('recentItems-addedOn')} {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/items")}>{t('recentItems-goToItems')}</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                {t('inventoryGrowth-title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-[4/3]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={inventoryData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                {t('recentActions-title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {recentActions.map((action) => (
                  <div key={action.id}>
                    <li className="flex flex-col">
                      <div className="font-medium">{action.type}</div>
                      <div className="text-sm text-gray-500">
                        {action.details}
                      </div>
                      <div className="text-xs text-gray-400">
                        {t('recentActions-by')} {action.user.name}{" "}
                        {new Date(action.createdAt).toLocaleString()}
                      </div>
                    </li>
                    <Separator className="my-4" />
                  </div>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                {t('categoryValueDistribution-title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full aspect-[4/3]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius="80%"
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardUi;

