import type { Metadata } from "next"
import { ReportsData } from "./reports-data"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reports.metadata')
  
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function ReportsPage() {
  return <ReportsData />
} 