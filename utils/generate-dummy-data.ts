import { format } from 'date-fns';

export interface Stats {
  totalValue: number;
  itemCount: number;
  packageCount: number;
  operationPackageCount: number;
}

export interface RecentAction {
  id: string;
  type: string;
  details: string;
  createdAt: Date;
  user: { name: string };
}

export interface InventoryData {
  date: string;
  count: number;
}

export interface Item {
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
  items: { value: number }[]
}
export interface DashboardData {
  stats: Stats;
  recentActions: RecentAction[];
  inventoryData: InventoryData[];
  categoryData: CategoryData[];
  items: Item[];
}

export function generateDummyData(): DashboardData {
  const stats: Stats = {
    totalValue: 111.11,
    itemCount: 750,
    packageCount: 100,
    operationPackageCount: 25
  };

  const recentActions: RecentAction[] = Array.from({ length: 5 }, (_, i) => ({
    id: `action-${i + 1}`,
    type: ['Création', 'Mise à jour', 'Suppression'][Math.floor(Math.random() * 3)],
    details: `Détails de l'action ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    user: { name: `Utilisateur ${i + 1}` }
  }));

  const inventoryData: InventoryData[] = Array.from({ length: 5 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    count: Math.floor(Math.random() * 1000) + 500
  }));

  const items: Item[] = Array.from({ length: 5 }, (_, i) => ({
    id: `item-${i + 1}`,
	brand: "Sony",
    name: `Item ${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 10000000000),
    category: [{ name: `Catégorie ${Math.floor(Math.random() * 5) + 1}` }],
    family: [{ name: `Famille ${Math.floor(Math.random() * 3) + 1}` }],
    subFamily: [{ name: `Sous-famille ${Math.floor(Math.random() * 2) + 1}` }]
  }));

  const categoryData: CategoryData[] = Array.from({ length: 5 }, (_, i) => ({
    name: `Catégorie ${i + 1}`,
    items: Array.from({ length: 5 }, () => ({ value: Math.floor(Math.random() * 100) }))
  }));

  return { stats, recentActions, inventoryData, items, categoryData };
}