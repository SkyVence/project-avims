import Link from "next/link"
import { Button } from "../components/ui/button"
import { useTranslations } from "next-intl"

export default function NotFound() {
  const t = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-6xl font-bold">{t('notFound.title')}</h1>
      <h2 className="text-2xl font-semibold mt-4">{t('notFound.heading')}</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        {t('notFound.description')}
      </p>
      <Button asChild className="mt-8">
        <Link href="/">{t('notFound.action')}</Link>
      </Button>
    </div>
  )
}

